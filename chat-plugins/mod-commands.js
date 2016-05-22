exports.commands = {
    rf: 'roomfounder',
	roomfounder: function (target, room, user) {
		if (!this.can('declare')) return false;
		if (!room.chatRoomData) return this.errorReply("/roomfounder - This room isn't designed for per-room moderation to be added.");
		target = this.splitTarget(target, true);
		let targetUser = this.targetUser;
		if (!targetUser) return this.errorReply("User '" + this.targetUsername + "' is not online.");
		if (room.isPersonal) return this.errorReply("You can't do this in personal rooms.");
		if (!room.auth) room.auth = room.chatRoomData.auth = {};
		let name = targetUser.name;
		room.auth[targetUser.userid] = '#';
		room.founder = targetUser.userid;
		this.addModCommand(name + ' was appointed to Room Founder by ' + user.name + '.');
		room.onUpdateIdentity(targetUser);
		room.chatRoomData.founder = room.founder;
		Rooms.global.writeChatRoomData();
	},

	roomdefounder: 'deroomfounder',
	deroomfounder: function (target, room, user) {
		if (!this.can('declare')) return false;
		if (!room.auth) return this.errorReply("/roomdeowner - This room isn't designed for per-room moderation");
		target = this.splitTarget(target, true);
		let targetUser = this.targetUser;
		let name = this.targetUsername;
		let userid = toId(name);
		if (room.isPersonal) return this.errorReply("You can't do this in personal rooms.");
		if (!userid || userid === '') return this.errorReply("User '" + name + "' does not exist.");
		if (room.founder !== userid) return this.errorReply("The specified user is not a roomowner.");
		delete room.auth[userid];
		delete room.founder;
		this.sendReply(name + ' was demoted from Room Founder by ' + user.name + '.');
		if (targetUser) targetUser.updateIdentity();
		if (room.chatRoomData) Rooms.global.writeChatRoomData();
	},
};