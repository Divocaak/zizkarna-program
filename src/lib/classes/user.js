import { Privilege } from "$lib/classes/privilege";
import { PUBLIC_PID_ADMIN, PUBLIC_PID_ANALYTICS, PUBLIC_PID_USERS } from "$env/static/public";

export class User {

    id;
    login;
    fName = "";
    lName = "";
    privileges = [];

    constructor({ id, login, fName = "", lName = "", privileges = [] }) {
        Object.assign(this, { id, login, fName, lName, privileges });
    }

    static fromJSON(json) {
        return new User({
            id: json.id,
            login: json.login,
            fName: json.fName,
            lName: json.lName,
            privileges: User.createPrivileges(json.privileges)
        });
    }

    toJSON() {
        return {
            id: this.id,
            login: this.login,
            fName: this.fName,
            lName: this.lName,
            privileges: this.privileges.map(p => ({ id: p.id, label: p.label }))
        };
    }

    setPrivileges(json) { this.privileges = User.createPrivileges(json); }

    static createPrivileges(json) { return json.map(privilege => new Privilege({ id: privilege.id, label: privilege.label })); }

    getInfoString() { return `Přihlášen jako <b>${this.lName} ${this.fName}</b> (id: <i>${this.id}</i>)`; }

    // Returns array of privilege IDs
    getPrivilegeIds() { return this.privileges.map(p => parseInt(p.id)); }
    // Check if user has a specific PID
    hasPermission(pid) { return this.getPrivilegeIds().includes(parseInt(pid)); }

    isAdmin() { return this.hasPermission(PUBLIC_PID_ADMIN); }
    isAnalytics() { return this.hasPermission(PUBLIC_PID_ANALYTICS); }
    isUsersAdmin() { return this.hasPermission(PUBLIC_PID_USERS); }
}
