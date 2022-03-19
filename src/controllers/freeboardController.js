import { db } from '../db'
import qs from 'qs';
import dayjs from 'dayjs'

// 자유게시판 목록 화면
export const list = (req, res) => {
    var pagenum = req.query.pagenum
    var page_group_num = req.query.page_group_num
    db.query('select * from freeboard order by idnum desc', [], (err, rows) => {
        if (err) {
            throw err
        }
        res.render('freeboard_list', { data:rows, pagenum, page_group_num })
        res.end()
    })
}

// 자유게시판 글쓰기 화면
export const write = (req, res) => {
    var pagenum = req.query.pagenum
    var page_group_num = req.query.page_group_num
    res.render('freeboard_write', {pagenum, page_group_num})
}

// 글쓰기 화면에서 입력한 내용을 freeboard 테이블에 저장하기
export const writting = (req, res) => {
    var body = '';
    req.on('error', (err) => console.log(err) )   
    req.on('data', (data) => body += data )       
    req.on('end', () => {
        var userid = req.query.userid
        var post = qs.parse(body)       
        const nowdate = dayjs()  
        db.query('insert into freeboard(title, content, wdate, hit, userid) values(?, ?, ?, ?, ?)', [post.title, post.content, nowdate.format('YYYY-MM-DD'), 0, userid], (error, rows) => {
            if (error) {
                    throw error
            }
        })
        res.redirect(`/freeboard/list?pagenum=1&page_group_num=1`)  
        res.end()
    })
}

export const view = (req, res) => {
    var pagenum = req.query.pagenum
    var getnum = req.query.idnum
    var gethit = req.query.hit
    var page_group_num = req.query.page_group_num
    db.query('update freeboard set hit=? where idnum=?', [++gethit, getnum], (err, rows)=>{
        if (err) {
            throw err
        }
    })
    db.query('select * from freeboard where idnum=?', getnum, (err, rows)=>{
        if (err) {
            throw err
        }
        res.render('freeboard_view', { data:rows, pagenum, page_group_num })
    })    

}

export const edit = (req, res) => {
    var pagenum = req.query.pagenum
    var getnum = req.query.idnum
    var page_group_num = req.query.page_group_num
    db.query('select * from freeboard where idnum=?', getnum, (err, rows)=>{
        if (err) {
            throw err
        }
        res.render('freeboard_edit', { data:rows, pagenum, page_group_num })
    })    
}

export const editting = (req, res) => {
    var pagenum = req.query.pagenum
    var getnum = req.query.idnum
    var page_group_num = req.query.page_group_num
    var body = '';
    req.on('error', (err) => console.log(err) )   
    req.on('data', (data) => body += data )  
    req.on('end', ()=>{
        var post = qs.parse(body)
        db.query('update freeboard set title=?, content=? where idnum=?', [post.title, post.content, getnum], (err, rows)=>{
            if (err) {
                throw err
            }
        })
    })
    res.redirect(`/freeboard/list?pagenum=${pagenum}&page_group_num=${page_group_num}`)
}

export const remove = (req, res)=>{
    var pagenum = req.query.pagenum
    var getnum = req.query.idnum
    db.query('delete from freeboard where idnum=?', getnum, (err, rows)=>{
        if (err) {
            throw err
        }
    })
    res.redirect(`/freeboard/list?pagenum=${pagenum}`)
}


export const pagegroup = (req, res) => {
    var page_group_num = req.query.page_group_num
    var total_page_group_num = req.query.total_page_group_num
    var direct = req.query.direct
    var total_page = req.query.total_page
    var pagenum = 0

    if (direct==1 && page_group_num==1) {
        pagenum = 1
    } else if (direct==1 && page_group_num!=1) {
        page_group_num--
        pagenum = page_group_num*10
    }
    

    if (direct==2 && page_group_num!=total_page_group_num) {
        page_group_num++
        pagenum = page_group_num*10-9
    } else if (direct==2 && page_group_num==total_page_group_num) {
        pagenum = total_page
    }


    res.redirect(`/freeboard/list?page_group_num=${page_group_num}&pagenum=${pagenum}`)
}