interface IUser {
	username: string;
	email: string;
	password: string;
	admin: boolean;
	status: boolean;
	created_at: Date;
	updated_at: Date;
}

export default IUser;