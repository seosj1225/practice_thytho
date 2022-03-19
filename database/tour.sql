데이터베이스명 : tour
테이블 2개 : member, notice
DB 관리자 아이디 : root
비밀번호 : ""

create database tour;

use tour;

create table member (
    idnum int not null auto_increment,
    email varchar(30) not null,
    irum varchar(10) not null,
    userid varchar(20) not null unique,
    pwd varchar(20) not null,
    phone varchar(20) not null,
    birthday varchar(20),
    registday date not null,
    primary key(idnum)
);

create table freeboard (
   idnum int not null auto_increment,
   title varchar(30) not null,
   userid varchar(20) not null,
   content varchar(300) not null,
   wdate varchar(15) not null,
   hit int,
   primary key(idnum),
   foreign key(userid) references member(userid)
);

foreign key 는 unique 조건이 있거나 primary key 인 필드만 설정할 수 있음


<NodeJS에서 mySql 사용하기>
0. 프로젝트 폴더에 npm install mysql 설치 : 처음 한번만
1. xampp 를 실행시켜 놓고, MySQL 만 start 
2. cmd 창에서 c드라이브로 이동 c:\>
3. 디렉토리 이동   c:\xampp\mysql\bin>
4. c:\xampp\mysql\bin> mysql -uroot -p
5. MariaDB> use tour   
   tour 데이터베이스가 없어졌다면 create database tour;
   member 테이블도 없어졌다면 위의 create table member() 복사해서 실행
6. MariaDB> desc member;           // member 테이블 구조(필드) 확인
   MariaDb> drop table member;     // member 테이블 삭제
7. MariaDB> select * from member;  // member 테이블의 모든 레코드 검색
   MariaDB> delete from member;    // member 테이블의 모든 레코드 삭제
   MariaDB> delete from member where 필드명='값';    // 조건에 맞는 레코드 한개 삭제
   MariaDB> alter table member modify 필드명 수정할자료형  // member 테이블의 필드의 자료형 수정하기
   MariaDB> update member set 필드명1="수정값", 필드명2="수정값" ... where userid='userid'   // member 테이블의 레코드 수정
8. cmd 창에서 한글이 깨져보이면 mysql을 종료 : ctrl + C 한후에 chcp 65001 엔터
9. 프로젝트 안에서 DB 연결 : db.js 파일 만들어 아래 내용 저장
   import mysql from 'mysql';
   export const db = mysql.createConnection({
        host : 'localhost',
        user : 'root',
        password : '',
        database : 'tour'
   })
   db.connect()
10. userController.js 의 loging(로그인진행), register(회원가입진행)에서 db 연결이 필요하므로 파일 맨위에 아래 내용 추가하여 사용함
   import { db } from '../db'    // 파일경로는 userController.js 기준하여 db.js 경로를 잘 적어줘야 함

