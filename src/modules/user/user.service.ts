import bcrypt from "bcryptjs";
import { pool } from "../../db";
import type { Iuser } from "./user.interface";

const createUserIntoDb = async (payload: Iuser) => {
  const { name, email, password, age } = payload;

  const hashPassword = await bcrypt.hash(password, 10);

  const result = await pool.query(
    `
        INSERT INTO users(name, email, password, age) VALUES($1,$2,$3,$4)
        RETURNING *
        `,
    [name, email, hashPassword, age],
  );

  delete result.rows[0].password;

  return result;
};

const getUsers = async () => {
  const result = await pool.query(`SELECT * FROM users`);

  return result;
};

const getUserById = async (id: string) => {
  const result = await pool.query(
    `
   
            SELECT * FROM users WHERE id = $1
            `,
    [id],
  );
  return result;
};

const updateUser = async (payload: Iuser,id: string) => {
  const { name, password, is_active, age } = payload;
  const result = await pool.query(`
        UPDATE users SET name = COALESCE($1, name), password = COALESCE($2, password), is_active = COALESCE($3, is_active), age = COALESCE($4, age) WHERE id = $5
        RETURNING *
        `, [name, password, is_active, age, id]);
  return result;
};

const deleteUser = async (id: string) => {
  const result = await pool.query(`
        DELETE FROM users WHERE id = $1
        RETURNING *
        `, [id]);
  return result;
};

export const userService = {
  createUserIntoDb,
  getUsers,
  getUserById,
  updateUser,
  deleteUser
};
