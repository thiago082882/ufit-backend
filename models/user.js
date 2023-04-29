const db = require('../config/config');
const bcrypt= require(`bcryptjs`);

const User = {};

User.getAll = () => {
  
    const sql = `SELECT * FROM users`;

    return db.manyOrNone(sql);
}

User.findByEmail = (email)=>{
    const sql = 
    `
    SELECT
        id,
        email,
        name,
        lastname,
        gender,
        birthdate,
        weight,
        height,
        image,
        password,
        session_token
    FROM 
        users
            
    WHERE 
         email = $1
    `;

    return db.oneOrNone(sql,email);

}

User.findById = (id,callback) => {
    const sql = 
    `
    SELECT
        id,
        email,
        name,
        lastname,
        gender,
        birthdate,
        weight,
        height,
        image,
        password,
        session_token
    FROM 
        users
            
    WHERE 
         id = $1
    `;

    return db.oneOrNone(sql,id).then(user =>{callback(null,user)})
    
}

User.create =async(user) => {

/*
* Criando a criptografia
*/
    const hash = await bcrypt.hash(user.password,10);

/*
* Fim da criptografia
*/

    const sql = `
    INSERT INTO 
        users(
            email,
            name,
            lastname,
            gender,
            birthdate,
            weight,
            height,
            image,
            password,
            created_at,
            updated_at


        )
        VALUES($1, $2, $3, $4 , $5, $6 , $7, $8, $9, $10, $11) RETURNING id 
    
    
    `;

    return db.oneOrNone(sql,[
        user.email,
        user.name,
        user.lastname,
        user.gender,
        user.birthdate,
        user.weight,
        user.height,
        user.image,
        hash,
        new Date(),
        new Date()
  

    ]);

}


User.update = (user) => {

    const sql = `
    UPDATE
        users
    SET
        name = $2,
        lastname = $3,
        gender = $4,
        birthdate = $5,
        weight = $6,
        height = $7,
        image = $8,
        updated_at = $9
    WHERE 
        id = $1
    `;

    return db.none(sql, [
        user.id,
        user.name,
        user.lastname,
        user.gender,
        user.birthdate,
        user.weight,
        user.height,
        user.image,
        new Date()
    ]);
    / Fim */
}




module.exports = User;