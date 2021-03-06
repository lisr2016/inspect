接口文档

1.POST /login

功能: 用户登陆

提交参数

    body:{
        phone : 手机号, 必填
        password : 密码, 长度6到16个任意字符
    }
返回数据

失败
状态码 400

返回格式 
    
      { code: 5, msg: 错误原因 }
成功
状态码 200
返回格式

    {
      code: 0, 
      msg: 登陆成功,
      data: {
        token: 1
      }
    }

2.GET /get/verifyCode

功能: 获取验证码

提交参数: 

   { phone: 手机号, 必填 }

返回数据

失败
状态码 400

返回格式

    { code: 5, msg: 错误原因 }
     
成功
状态码 200
返回格式

    {
      code: 0, 
      msg: 成功,
      data: {
        verifyCode: XXX
      }
    }


3.GET /check/verifyCode

功能: 校验验证码

提交参数: 
    
    {
        phone: 手机号, 必填
        verifyCode: 验证码, 必填
    }

返回数据:

失败
状态码 400
返回格式 

    { 
      code: 5, msg: 验证码错误
    }
    
成功
状态码 200
返回格式
 
    {
      code: 0, 
       msg: 校验成功 
    }

4.POST /reset/password

功能: 重置密码

提交参数

参数字段

    body{
        verifyCode: ,//验证码, 必填
        password : .//密码, 长度6到16个任意字符，必填
        newPassword : //新密码, 长度6到16个任意字符，必填
    }
    
返回数据

失败
状态码 400
返回格式 

    {
      code: 5, 
      msg: XXX
    } 
    
成功
状态码 200
返回格式

    {
      code: 0, 
      msg: 更改成功,
      data: {
        token: XXX
      }
    }
    

5.GET /v1/user/info

功能: 获取用户信息

提交参数: 无

返回数据:

失败
状态码 400
返回格式 

    {  
      code: 5, 
       msg: 未登录
    }
    
成功
状态码 200
返回格式

    {
      code: 0, 
      data: {
        orgInfo:
        {
          name: XXX, // 机构名称
          initialized: false,    // 是否进行过初始化信息填报
          corporationPhone: XXX   // 法人电话
          managerPhone: XXX   // 负责人电话
          bednum: XXX   // 床位数
          address: XXX   // 地址
          level: XXX   // 级别
          street: XXX   // 街道
        }
    }

6.POST /v1/init/org/info

功能: 机构信息初始化填报

参数字段

    body{ 
          corporationPhone: XXX   // String,非必填 法人电话
          managerPhone: XXX   // String,必填 负责人电话
          bednum: XXX   // Number,非必填, 床位数
          address: XXX   // String,必填 地址
          level: XXX   // String,必填 级别
          street: XXX   // String,必填 街道
    }
    
返回数据
失败
状态码 400
返回格式 

    {
      code: 5, 
       msg: XXX
      }
    
成功
状态码 200
返回格式

    {
      code: 0, 
      msg: 更新成功
    }
    
7.GET /v1/message/list

功能: 用户消息列表

提交参数

参数字段

    无
    
返回数据

失败
状态码 400
返回格式 

    {
      code: 5, 
      msg: XXX
    }
    
成功
状态码 200

返回格式
 
    {       
     code: 0,  
     msg: 查询成功
     data: {
         list:[
            {   
                title: XXX // String 显示标题
                content: XXX //  String 内容,type 为1时有这个字段
                type: XXX  //  String  消息类型，(根据type枚举值判断跳转)1.公告信息 2.跳转生活日报 3跳转生活周报 4跳转生活月报 4调整医疗月报
                isRead: false // Boolean 是否已读
                createTime: XXX // 推送时间
            }, ...
         ]
     }
    }

8.GET /v1/message/:id

功能: 消息事项已处理(已跳转)

提交参数

参数字段

    无
    
返回数据

失败
状态码 400
返回格式 

    {
      code: 5, 
      msg: XXX
    }
    
成功
状态码 200

返回格式
 
    {       
     code: 0,  
     msg: 提交成功
    }
 
 

8.1.GET /v1/message/:id

功能: 消息事项已处理(已跳转)

提交参数

参数字段

    无
    
返回数据

失败
状态码 400
返回格式 

    {
      code: 5, 
      msg: XXX
    }
    
成功
状态码 200

返回格式
 
    {       
     code: 0,  
     msg: 提交成功
    }
 
 
9.POST /v1/domestic/daily

功能: 提交生活垃圾日报。

提交参数：

    body :{
          time: 填报日期 本日零点时间戳
          meetingTimes: XXX  // Number, 管理工作会议次数
          meetingHost: XXX // String,管理工作会议主持人
          meetingContent: XXX //  String,会议具体事项
          selfTimes: XXX //  Number,  自测、巡查次数
          selfProblems: XXX // Number,  存在问题数目
          selfContent: XXX //  String,主要涉及问题
          selfCorrected: XXX //Boolean 是否改正到位
          advertiseTimes: XXX  //  Number, 宣传次数
          advertiseContent: XXX //  String, 宣传方式
          traningTimes: XXX //  Number,  培训次数
          trainees: XXX //  Number,  培训人数
          traningContent: XXX //  String, 培训内容
          govTimes: XXX //  Number,  政府检查次数
          govProblems: XXX // Number,  存在问题数目
          govContent: XXX // String, 主要涉及问题
          govCorrected: XXX // Boolean, 是否改正到位
    }

返回数据

失败
状态码 400
返回格式范例

    {
     code: 5, 
     msg: XXX
    }
    
成功
状态码 200
返回格式
 
    {     
      code: 0, 
      msg: 提交成功 
     }

 
10.POST /v1/domestic/weekly

功能: 提交生活垃圾周报。

提交参数：

    body :{
          time: //填报日期 ，周周四零点时间戳
          consignee: XXX // Number, 收运人员人数
          guide: XXX // Number, 看守引导人员人数
          inspector: XXX // Number, 监督检查人员人数
          kitchenWasteCollectors: XXX // Number, 厨余垃圾投放收集容器(个)
          kitchenWastePositions: XXX // Number, 厨余垃圾单位暂时存放点(个)
          recyclableWasteCollectors: XXX // Number, 可回收垃圾投放收集容器(个)
          recyclableWastePositions: XXX // Number, 可回收垃圾单位暂时存放点(个)
          harmfulWasteCollectors: XXX // Number, 有害垃圾投放收集容器(个)
          harmfulWastePositions: XXX // Number, 有害垃圾单位暂时存放点(个)
          otherWasteCollectors: XXX // Number, 其它垃圾投放收集容器(个)
          otherWastePositions: XXX // Number, 其它垃圾单位暂时存放点(个)
          medicWasteCollectors: XXX // Number, 医疗垃圾投放收集容器(个)
          medicWastePositions: XXX // Number, 医疗垃圾单位暂时存放点(个)
          bulkyWastePositions: XXX // Number, 大件垃圾单位暂时存放点(处)
          kitchenWaste: XXX // Number, 厨余垃圾(公斤)
          recyclableWaste: XXX // Number, 可回收垃圾(公斤)
          harmfulWaste: XXX // Number, 有害垃圾(公斤)
          otherWaste: XXX // Number, 其他垃圾(公斤)
          medicWaste: XXX // Number, 医疗废物(公斤)
    }

返回数据

失败
状态码 400
返回格式范例

    {
     code: 5, 
     msg: XXX
    }
    
成功
状态码 200
返回格式
 
    { 
      code: 0, 
      msg: 提交成功
     }
    
 
11.POST /v1/domestic/monthly

功能: 提交生活垃圾月报。

提交参数：

    body :{
          time: , // 填报日期 ，月初的时间戳
          kitchenWaste: XXX // Number, 厨余垃圾(公斤)
          recyclableWaste: XXX // Number, 可回收垃圾(公斤)
          harmfulWaste: XXX // Number, 有害垃圾(公斤)
          bulkyWaste: XXX // Number, 大件废物(公斤)
          otherWaste: XXX // Number, 其他垃圾(公斤)
    }

返回数据

失败
状态码 400
返回格式范例

    

    {
     code: 5, 
     msg: XXX
    }
    
成功
状态码 200
返回格式
 
    { 
      code: 0, 
      msg: 提交成功
     }
    
 
12.POST /v1/medic/monthly

功能: 提交医疗垃圾月报。

提交参数：

    body :{
          time: ，// 填报日期 ，月初的时间戳
          totalWeight:  XXX // Number, 月医疗垃圾产量(公斤)
    }

返回数据

失败
状态码 400
返回格式范例

    {
     code: 5, 
     msg: XXX
    }
    
成功
状态码 200
返回格式
 
    { 
      code: 0, 
      msg: 提交成功
     }

13.POST /cms/login

功能: 管理端登陆。

提交参数：

    body :{
      phone,
      password
    }

返回数据

失败
状态码 400
返回格式范例

    {
     code: 5, 
     msg: XXX
    }
    
成功
状态码 200
返回格式
 
    { 
      code: 200,
      msg: 查询成功,
      data: 
        token: 
     }
     
 13.1 GET /cms/user/info
 
 功能: 管理员用户信息。
 
 提交参数：
 
 返回数据
 
 失败
 状态码 400
 返回格式范例
 
     {
      code: 5, 
      msg: XXX
     }
     
 成功
 状态码 200
 返回格式
  
     { 
       code: 200,
       msg: 查询成功,
       data: 
            user: {
                idv: 5f5fc3ffed8da219bc89963b,
                phone: xx,
                username: 管理员1,
                authority: 1
            }
      }
      
      
14.POST /cms/reset/password

功能: 管理端登陆。

提交参数：

    body{
        verifyCode: 验证码, 必填
        password : 密码, 长度6到16个任意字符，必填
        newPassword : 新密码, 长度6到16个任意字符，必填
    }

返回数据

失败
状态码 400
返回格式范例

    {
     code: 5, 
     msg: XXX
    }
    
成功
状态码 200
返回格式
 
    { 
      code: 200,
      msg: 修改成功
     }

15.POST /cms/get/user/list

功能: 获取用户列表。

提交参数：

    body :{
      search, // String, 查询 手机号、机构名称
      offset, // 页数, 默认1
      limit, // 每页大小, 默认50
      rule // 正序/倒叙 暂不支持
      sort,  // String, 暂不支持
      isAdmin, // Boolean，是否是管理员，暂不支持
    }

返回数据

失败
状态码 400
返回格式范例

    {
     code: 5, 
     msg: XXX
    }
    
成功
状态码 200
返回格式
 
    { 
      code: 200,
      msg: 查询成功,
      data: 
        count: XX // Number 总人数
        list: [
           {
             phone: XX,
             orgInfo: {
                  // 同接口5 orgInfo
                }
             initialized: true,
             isAdmin: false,
             authority: XXX, //管理员级别
           },
         ]
     }


16.POST /cms/new/user

功能: 新增用户。

提交参数：

    body :{
      phone,    // 必填
      password, // 非必填
      organizationName, // 机构名称
    }

返回数据

失败
状态码 400
返回格式范例

    {
     code: 5, 
     msg: XXX
    }
    
成功
状态码 200
返回格式
 
    { 
      code: 0, 
      msg: 添加成功
     }

17.POST /cms/update/user/info

功能: 修改用户信息(修改密码)。

提交参数：

    body :{
      userId, // 用户id，必填
      password, // 密码, 必填
    }

返回数据

失败
状态码 400
返回格式范例

    {
     code: 5, 
     msg: XXX
    }
    
成功
状态码 200
返回格式
 
    { 
      code: 0, 
      msg: 提交成功
     }

18.POST /cms/update/org/info

功能: 修改机构信息。

提交参数：

      body{ 
        organizationId: XXX // 机构id
        corporationPhone: XXX   // 法人电话
        managerPhone: XXX   // 负责人电话
        bednum: XXX   // 床位数
        address: XXX   // 地址
        level: XXX   // 级别
        street: XXX   // 街道
      }

返回数据

失败
状态码 400
返回格式范例

    {
     code: 5, 
     msg: XXX
    }
    
成功
状态码 200
返回格式
 
    { 
      code: 0, 
      msg: 提交成功
     }

19.GET /cms/summary/total

功能: 查询报告总数。

提交参数：

   无

返回数据

失败
状态码 400
返回格式范例

    {
     code: 5, 
     msg: XXX
    }
    
成功
状态码 200
返回格式
 
    { 
      code: 0, 
      msg: 查询成功
      data: {
        count: XXX   // 所需报告总数(机构总数)
      }
     }
   

20.POST /cms/summary/domestic/daily

功能: 生活垃圾日报汇总。

提交参数：

      body{ 
        startTime:  // 开始时间,
        endTime:  // 结束时间,
      }

返回数据

失败
状态码 400
返回格式范例

    {
     code: 5, 
     msg: XXX
    }
    
成功
状态码 200
返回格式
 
    { 
    code: 200,
    msg: 查询成功,
      data:{
         meetingTimes: // 会议次数,
         selfInspectionTimes: // 自查次数,
         selfInspectionProblems: // 自查问题数目,
         advertiseTimes: // 推广次数,
         traningTimes: // 培训次数,
         trainees: // 参与培训人员,
         govInspectionTimes: // 政府检查次数,
         govInspectionProblems: // 政府检查出问题数目,
         reportCount: // 上交报告总数,
         }
      } 

21.POST /cms/summary/domestic/weekly

功能: 生活垃圾周报汇总。

提交参数：

      body{ 
        startTime:  // 开始时间,
        endTime:  // 结束时间,
      }

返回数据

失败
状态码 400
返回格式范例

    {
     code: 5, 
     msg: XXX
    }
    
成功
状态码 200
返回格式
 
    { 
    code: 200,
    msg: 查询成功,
      data:  {     
          consignee:  // 专兼职收运人员数,
          guide:  // 专兼职引导人员数,
          inspector:  // 专兼职监督检查人员数,      
          kitchenWaste:  // 厨余垃圾(公斤)
          recyclableWaste:  // 可回收垃圾(公斤)
          harmfulWaste:  // 有害垃圾(公斤)
          otherWaste:  // 其他垃圾(公斤)
          medicWaste:  // 医疗垃圾(公斤)
          reportCount:  // 总计报告数目
      } 
     }

22.POST /cms/summary/domestic/monthly

功能: 生活垃圾月报汇总。

提交参数：

      body{ 
        startTime:  // 开始时间,
        endTime:  // 结束时间,
      }

返回数据

失败
状态码 400
返回格式范例

    {
     code: 5, 
     msg: XXX
    }
    
成功
状态码 200
返回格式
 
    {
      code: 200,
      msg: 查询成功,
      data: {
        kitchenWaste: '', // 厨余垃圾(公斤)
        recyclableWaste: '', // 可回收垃圾(公斤)
        harmfulWaste: '', // 有害垃圾(公斤)
        bulkyWaste: '', // 大件垃圾(公斤)
        otherWaste: '', // 其他垃圾(公斤)
        reportCount: ''// 总计报告数目
      }
    } 

 
23.POST /cms/summary/medic/monthly

功能: 医疗垃圾月报汇总。

提交参数：

      body{ 
        startTime:  // 开始时间,
        endTime:  // 结束时间,
      }

返回数据

失败
状态码 400
返回格式范例

    {
     code: 5, 
     msg: XXX
    }
    
成功
状态码 200
返回格式
 
    { 
    code: 200,
    msg: 查询成功,
      data: {
        totalWeight: XXX, //
      }
      } 
      
      
24.POST /cms/summary/screen

功能: 数据大屏数据汇总。

提交参数：

      body{ 
        startTime:  // 开始时间,
        endTime:  // 结束时间,
        type: // String  1.月报，2.年报
      }

返回数据

失败
状态码 400
返回格式范例

    {
     code: 5, 
     msg: XXX
    }
    
成功
状态码 200
返回格式
 
        {
            code: 0,
            data: {
                list: [
                    {
                        kitchenWaste: 10,
                        recyclableWaste: 1,
                        harmfulWaste: 2,
                        otherWaste: 2,
                        medicWaste: 3,
                        reportCount: 4
                    },
                    {
                        kitchenWaste: 0,
                        recyclableWaste: 0,
                        harmfulWaste: 0,
                        otherWaste: 0,
                        medicWaste: 0,
                        reportCount: 0
                    }
                ],
                weeks: [
                    2020-09-16,
                    2020-09-23
                ]
            },
            msg: 查询成功
        }
    
       {
           code: 0,
           data: {
               list: [
                   {
                       kitchenWaste: 0,
                       recyclableWaste: 0,
                       harmfulWaste: 0,
                       otherWaste: 0,
                       bulkyWaste: 0,
                       reportCount: 0
                   },
                   {
                       kitchenWaste: 0,
                       recyclableWaste: 0,
                       harmfulWaste: 0,
                       otherWaste: 0,
                       bulkyWaste: 0,
                       reportCount: 0
                   }
               ],
               months: [
                   9月,
                   10月
               ]
           },
           msg: 查询成功
       }
