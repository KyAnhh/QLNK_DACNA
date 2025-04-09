const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { Pool } = require("pg");
const bcrypt = require('bcrypt');
require("dotenv").config();

const app = express();
// const port = PORT || 5000;
const port = process.env.PORT || 5000;


// Middleware
app.use(cors());
app.use(bodyParser.json());

// PostgreSQL Pool
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'QLNK',
  password: 'kyanh',
  port: 5432,
});

// Sample route
app.get("/api/nguoidung", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM nguoidung");
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

//dangky
// app.post('/api/dangky', async (req, res) => {
//     const {tendangnhap, matkhau, vaitro} = req.body;

//     try {
//         // Kiem tra trung ten dang nhap
//         const userExists = await pool.query('SELECT * FROM nguoidung WHERE tendangnhap = $1', [tendangnhap]);
//         if(userExists.rows.length > 0) {
//             return res.status(400).json({message: 'Tên đăng nhập đã tồn tại'});
//         }

//         // // Mã hóa mật khẩu 
//         // function validatePassword(matkhau) {
//         //     const specialCharRegex = /[@#$%^&*(),.?":{}|<>]/; // Kiểm tra ký tự đặc biệt
//         //     if (matkhau.length > 5 && specialCharRegex.test(matkhau)) {
//         //       return true; // Mật khẩu hợp lệ
//         //     }
//         //     return false; // Mật khẩu không hợp lệ
//         //   }

//         //   async function handlePassword(matkhau){
//         //     //kiem tra ma khau co hop le khong
//         //     if(!validatePassword(matkhau)){
//         //         return {error: 'Mật khẩu không hợp lệ. Mật khẩu phải dài hơn 5 ký tự và chứa ít nhất một ký tự đặc biệt.'};
//         //     }

//         //     //Ma hoa mat khau sau khi hop le 
//         //     const hashedPassword = await bcrypt.hash(matkhau,10)
//         //     return {success : true, hashedPassword};
//         //   }

//         // // Thêm người dùng mới 
//         // await pool.query(
//         //     'INSERT INTO nguoidung (tendangnhap, matkhau, vaitro) VALUES ($1,$2,$3)',
//         //     [tendangnhap, hashedPassword, vaitro]
//         // );

//         const bcrypt = require('bcrypt');

// // Hàm kiểm tra mật khẩu
// function validatePassword(matkhau) {
//     const specialCharRegex = /[@#$%^&*(),.?":{}|<>]/; // Kiểm tra ký tự đặc biệt
//     if (matkhau.length > 5 && specialCharRegex.test(matkhau)) {
//         return true; // Mật khẩu hợp lệ
//     }
//     return false; // Mật khẩu không hợp lệ
// }

// // Hàm xử lý mật khẩu
// async function handlePassword(matkhau) {
//     // Kiểm tra mật khẩu có hợp lệ không
//     if (!validatePassword(matkhau)) {
//         return { error: 'Mật khẩu không hợp lệ. Mật khẩu phải dài hơn 5 ký tự và chứa ít nhất một ký tự đặc biệt.' };
//     }

//     // Mã hóa mật khẩu sau khi hợp lệ
//     const hashedPassword = await bcrypt.hash(matkhau, 10);
//     return { success: true, hashedPassword };
// }

// // Hàm thêm người dùng mới
// async function addUser(tendangnhap, matkhau, vaitro) {
//     // Gọi hàm xử lý mật khẩu
//     const passwordResult = await handlePassword(matkhau);

//     if (passwordResult.error) {
//         // Nếu mật khẩu không hợp lệ, trả về lỗi
//         return { error: passwordResult.error };
//     }

//     // Nếu thành công, lấy hashedPassword
//     const hashedPassword = passwordResult.hashedPassword;

//     try {
//         // Thêm người dùng mới vào cơ sở dữ liệu
//         await pool.query(
//             'INSERT INTO nguoidung (tendangnhap, matkhau, vaitro) VALUES ($1, $2, $3)',
//             [tendangnhap, hashedPassword, vaitro]
//         );
//         return { success: true, message: 'Người dùng đã được thêm thành công!' };
//     } catch (error) {
//         return { error: 'Đã xảy ra lỗi trong quá trình thêm người dùng.' };
//     }
// }
//     } catch (error) {
//         console.error(error.message);
//         res.status(500).send("Lỗi server");
//     }
// });

// Đăng ký
app.post('/api/register', async (req, res) => {
  const { tendangnhap, matkhau, vaitro } = req.body;
  console.log(req.body);
  try {
    // Kiểm tra trùng tên đăng nhập
    const userExists = await pool.query('SELECT * FROM nguoidung WHERE tendangnhap = $1', [tendangnhap]);
    if (userExists.rows.length > 0) {
      return res.status(400).json({ message: 'Tên đăng nhập đã tồn tại' });
    }

    // Mã hóa mật khẩu
    const hashedPassword = await bcrypt.hash(matkhau, 10);
    console.log(hashedPassword);  
    // Thêm người dùng mới
    await pool.query(
      'INSERT INTO nguoidung (tendangnhap, matkhau, vaitro) VALUES ($1, $2, $3)',
      [tendangnhap, hashedPassword, vaitro]
    );

    res.status(201).json({ message: 'Đăng ký thành công' });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Lỗi server' });
  }
});


// Đăng nhập
app.post('/api/dangnhap', async (req, res) => {
    const {tendangnhap, matkhau} = req.body;
    console.log(req.body);
    try {
        // kiểm tra tên đăng nhập và mật khẩu 
        const user = await pool.query('SELECT * FROM nguoidung WHERE tendangnhap = $1', [tendangnhap]);
        if(user.rows.length === 0) {
            return res.status(400).json({message: 'Tên đăng nhập không tồn tại'});
        }

        const validPassword = await bcrypt.compare(matkhau, user.rows[0].matkhau);
        console.log(validPassword);
        if(!validPassword){
            return res.status(400).json({message: 'Mật khẩu không đúng'});
        }

        //Thong bao dang nhap thanh cong
        res.status(200).json({message: 'Đăng nhập thành công', user: user.rows[0]});
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Lỗi server");
    }
})

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
