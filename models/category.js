var pool =require('./pool')


class ClassModel{
    constructor(){}
    getListData(callback){
        pool.getConnection(function(err,connection){
            if(err) throw err;
            connection.query("select * from category",function(err,results){
                
                var data = [];
                results.forEach(ele=>{
                    if(!ele.parent_id){//代表的是1级分类
                        ele.children = [];
                        data.push(ele)
                        console.log(data);
                    }else {
                        data.forEach((cate,index)=>{
                            if(cate.cate_id==ele.parent_id){
                                data[index].children.push(ele)
                            }
                        })
                    }
                })
                callback(data)
                //释放连接
                connection.release()    
            })
        })
    }
     getCateData(params,callback){//还有一种方法就是先把所有的一级分类全部获取过来，二级分类先不获取，当点击一级分类获取的时候，在获取对应的二级分类
        pool.getConnection(function(err,connection){
            if(err) throw err;
            var parent_id = params.parent_id || 0
            connection.query("select * from category where parent_id="+parent_id,function(err,results){
                callback(results)
                //释放连接
                connection.release()
            })
        })
    }
}

module.exports = ClassModel