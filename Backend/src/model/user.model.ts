

class UserModel {
    id: string;
    email: string;
    password: string;
    created_at: string;
    is_admin: string;
    is_deleted: string;
    phone: string;
    is_sent: string;

   constructor(id: string, email: string, password: string, created_at: string, is_admin:string, is_deleted: string, phone: string, is_sent: string) {
       this.id = id;
       this.email = email;
       this.password = password;
       this.created_at = created_at;
       this.is_admin = is_admin;
       this.is_deleted = is_deleted;
       this.phone = phone;
       this.is_sent = is_sent;
   }
}


export default UserModel;