const express=require('express');
const app=express();


const pool=require('../config/database.js');

class Users{
    static async create(userData){
        const query='INSERT INTO register (username, email, password, status) VALUES ($1, $2, $3, $4) RETURNING *';
        const values=[userData.username, userData.email, userData.password, userData.status];
        try {
            const result= await pool.query(query, values);
            return result.rows[0];
        } catch (error) {
            console.error('Error creating user:', error);
            throw error;
        }
    }
  
  

    static async findById(id){
        const query='SELECT * FROM register WHERE id=$1';
        const values=[id];
        try {
            const result= await pool.query(query, values);
            return result.rows[0];
        } catch (error) {
            console.error('Error finding user by ID:', error);
            throw error;
        }
    }


    static async findByEmail(email){
        const query='SELECT * FROM register WHERE email=$1';
        const values=[email];
        try {
            const result= await pool.query(query, values);
            return result.rows[0];
        } catch (error) {
            console.error('Error finding user by email:', error);
            throw error;
        }
    }
  static async findByUsername(username){
        const query='SELECT * FROM register WHERE username=$1';
        const values=[username];   
        try {
            const result= await pool.query(query, values);
            return result.rows[0];
        } catch (error) {
            console.error('Error finding user by username:', error);
            throw error;
        }
    }

    static async updateStatus(id, status){
        const query='UPDATE register SET status=$1 WHERE id=$2 RETURNING *';
        const values=[status, id];
        try {
            const result= await pool.query(query, values);
            return result.rows[0];
        } catch (error) {
            console.error('Error updating user status:', error);
            throw error;
        }
    }

    static async getAllUsers(){
        const query='SELECT * FROM register';
        try {
            const result= await pool.query(query);
            return result.rows;
        } catch (error) {
            console.error('Error getting all users:', error);
            throw error;
        }
    }



    static async deleteUser(id){
        const query='DELETE FROM register WHERE id=$1 RETURNING *';
        const values=[id];
        try {
            const result= await pool.query(query, values);
            return result.rows[0];
        } catch (error) {
            console.error('Error deleting user:', error);
            throw error;
        }
    }
}

module.exports=Users;
