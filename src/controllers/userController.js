import { db } from '../db'
import qs from 'qs';
import dayjs from 'dayjs'
import nodemailer from 'nodemailer'

export const join = (req, res) => res.render("join") 
export const login = (req, res) => res.render("login")

export const idchk = (req, res) => {
   var getid = req.query.userid
   db.query('select * from member where userid=?', getid, (err, rows)=>{
        if (err) {
            throw err;
        }
        if (rows.length) {
            res.render('userChkid', {message:"아이디는 중복됩니다.", userid:getid})
        } else {
            res.render('userChkid', {message:"아이디는 사용 가능합니다.", userid:getid})
        }
   }) 
}

export const register = (req, res) => {
    var body = '';
    req.on('error', (err) => console.log(err) )   // 요청에 에러가 있으면 실행
    req.on('data', (data) => body += data )       // 요청에 데이터가 있으면 body에 data를 옮김
        console.log(body)                         // email_id=tsalt&email_domain=hanmail.net~~~ (쿼리스트링)
    req.on('end', () => {                         // 요청의 데이터가 모두 받아졌으면 db에 저장
        var post = qs.parse(body)                 // 쿼리스트링이 객체로 바뀜 : qs.parse()
        console.log(post)                         // post = { email_id:"tsalt", email_domain:"hanmail.net", .... }

        db.query('select * from member where userid=?', post.userid, (error, rows) => {
            if (error) {
                throw error
            }
            if (rows.length) {
                res.send("<script> alert('중복된 아이디입니다.'); location.href=document.referrer; </script>")
            } else {
                const nowdate = dayjs()
                db.query('insert into member(email, irum, userid, pwd, phone, birthday, registday) values(?, ?, ?, ?, ?, ?, ?)', [post.email_id+"@"+post.email_domain, post.irum, post.userid, post.pwd, post.phone, post.birthday, nowdate.format('YYYY-MM-DD')], (error, rows) => {
                    if (error) {
                        throw error
                    }
                })
                res.redirect('/')  
                res.end()
            }
        })
    })
}


export const loging = (req, res) => {
    var body = '';
    req.on('error', (err) => console.log(err) )  
    req.on('data', (data) => body += data )
    req.on('end', ()=>{                         // 요청값으로 들어온 userid와 pwd를 받아서
        var post = qs.parse(body)               // login.ejs의 name값 확인 : userid(아이디), pwd(비밀번호)
        db.query('select * from member where userid=?', post.userid, (err, rows)=>{
            if (err) {
                throw err;
            }
            if (rows.length) {
                if (rows[0].pwd===post.pwd) {
                    req.session.loggedIn = true
                    req.session.userid = rows[0].userid  // post.userid 와 같음
                    res.redirect('/')
                    res.end()
                } else {
                    res.send("<script> alert('비밀번호가 맞지 않습니다.'); location.href=document.referrer; </script>")    
                }
            } else {
                res.send("<script> alert('아이디가 존재하지 않습니다.'); location.href=document.referrer; </script>")
            }
        })
    })
}

export const logout = (req, res) => {
    req.session.destroy()
    res.clearCookie('sid')
    res.redirect('/')
}


export const edit = (req, res) => {
    var getid = req.query.userid
    db.query('select * from member where userid=?', getid, (err, rows) => {
        if (err) {
            throw err;
        }
        if (rows.length) {
            res.render('join_edit', {
                idnum : rows[0].idnum,
                email : rows[0].email,
                irum : rows[0].irum,
                userid : rows[0].userid,
                pwd : rows[0].pwd,
                phone : rows[0].phone,
                birthday : rows[0].birthday
            })
        }
    })
}

export const editing = (req, res) => {
    var body = '';
    req.on('error', (err) => console.log(err) )   
    req.on('data', (data) => body += data )       
    req.on('end', () => {
        var getnum = req.query.idnum      
        var post = qs.parse(body)         
        db.query('update member set email=?, irum=?, pwd=?, phone=?, birthday=? where idnum=?', [post.email_id+"@"+post.email_domain, post.irum, post.pwd, post.phone, post.birthday, getnum], (error, rows) => {
            if (error) {
                    throw error
            }
        })
        res.redirect('/')  
        res.end()
    })
}


export const memberout = (req, res) => {
    var getnum = req.query.idnum
    db.query('delete from member where idnum=?', getnum, (error, rows)=>{
        if (error) {
            throw error
        }
    })
    res.render('memberout', {message:"회원님의 정보는 삭제되었습니다."})
}


// 아이디찾기화면 팝업창
export const findid = (req, res) => res.render('findid')

// 아이디찾기 진행하기
export const findingid = (req, res) => {
    var body = '';
    req.on('error', (err) => console.log(err) )   
    req.on('data', (data) => body += data )       
    req.on('end', () => {
        var post = qs.parse(body)
        db.query('select * from member where irum=? and email=?', [post.irum, post.email], (err, rows) => {
            if (err) {
                throw err;
            }
            if (rows.length) {
                var userid = rows[0].userid
                var strcount = userid.length
                userid = userid.slice(0, 4)
                var diff = strcount - 4
                for (let i=0; i<diff; i++) {
                    userid += '*'
                }
                res.render('findid', { userid })
            } else {
                res.send("<script> alert('일치하는 정보가 없습니다.'); location.href = document.referrer </script>")
            }

        })
    })
}


// 비밀번호찾기화면 팝업창
export const findpw = (req, res) => res.render('findpw')

// 비밀번호찾기 진행하기
export const findingpw = (req, res) => {
    var body = '';
    req.on('error', (err) => console.log(err) )   
    req.on('data', (data) => body += data )       
    req.on('end', () => {
        var post = qs.parse(body)
        db.query('select * from member where userid=? and email=?', [post.userid, post.email], (err, rows) => {
            if (err) {
                throw err;
            }
            if (rows.length) {
                var useremail = rows[0].email
                var variable = "0,1,2,3,4,5,6,7,8,9,a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u,v,w,x,y,z".split(","); 
                var randomPassword = createRandomPassword(variable, 8); 
                function createRandomPassword(variable, passwordLength) { 
                    var randomString = ""; 
                    for (let j=0; j<passwordLength; j++) {
                        randomString += variable[Math.floor(Math.random()*variable.length)]; 
                    }
                    return randomString 
                }

                const transporter = nodemailer.createTransport({ 
                    service: 'naver',   
                    port: 587,
                    host: 'smtp.naver.com',  
                    secure: false,  
                    requireTLS: true,
                    auth: {
                        user: '본인 네이버 이메일주소',  
                        pass: '본인 네이버 비밀번호'   
                    }
                }); 

                const emailOptions = { 
                    from: '본인 네이버 이메일주소', 
                    to: useremail, 
                    subject: 'Tour에서 임시비밀번호를 알려드립니다.', 
                    html: "<h1 >Tour에서 새로운 비밀번호를 알려드립니다.</h1> <h2> 비밀번호 : " + randomPassword + "</h2>" +'<h3 style="color: crimson;">임시 비밀번호로 로그인 하신 후, 반드시 비밀번호를 수정해 주세요.</h3>'
                }; 

                transporter.sendMail(emailOptions, res);

                db.query('update member set pwd=? where email=? and userid=?', [randomPassword, post.email, post.userid], (error, rows)=>{
                    if (error) {
                        throw error
                    }
                })
                res.send("<script> alert('이메일로 임시 비밀번호를 전송했습니다.'); location.href = document.referrer </script>")
            } else {
                res.send("<script> alert('일치하는 정보가 없습니다.'); location.href = document.referrer </script>")
            }

        })
    })
}