let _ = require('lodash');
let config = require('../config');
let jwt = require('jsonwebtoken');

let Admin = require('../models/Admin');
let User = require('../models/User');
let Organization = require('../models/Organization');
const ObjectId = require('mongodb').ObjectId;


const Joi = require('joi')
const bcrypt = require('bcrypt-nodejs');
const { isPhoneNum } =require('../util/lib')

exports.login = function(req, res) {
    if (!req.body.phone || !req.body.password) {
        res.status(400).send({code: 5, msg: '缺少手机号、密码'});
        return
    }
    Admin.findOne({
        phone: req.body.phone
    }, function(err, user) {
        if (err) throw err;
        if (!user) {
            res.status(400).send({code: 5, msg: '用户名不存在'});
        } else {
            user.comparePassword(req.body.password, function (err, isMatch) {
                if (isMatch && !err) {
                    let token = jwt.sign(user.toJSON(), config.cms_secret);
                    res.json({code: 0, data: {token: token}, msg: '登陆成功'});
                } else {
                    res.status(401).send({code: 5, msg: '密码错误'});
                }
            });
        }
    });
};

exports.fetchUserInfo = function (req, res) {
    res.status(200).send({code: 0, data: {user: req.admin}, msg: '查询成功'});
};



const fetchUserListSchema = {
    search: Joi.string(),
    offset: Joi.number().default(1),
    limit: Joi.number().default(50)
}

exports.fetchUserList = async function (req, res) {
    try {
        let list = []
        const params = await Joi.validate(req.body, fetchUserListSchema);
        if (params.search) {
            if (isPhoneNum(params.search)) {
                // 查找@User.phone 精确匹配
                list = await User.find({phone: params.search})
            } else {
                // 查找@Organization.name 模糊匹配
                let orgList = await Organization.find({name: new RegExp(params.search)}, '_id');
                if (_.size(orgList) > 0) {
                    list = await User.find({organization_id: {$in: _.map(orgList, i => i._id)}});
                }
            }
            let start = (params.offset - 1) * params.limit;
            let stop = params.offset * params.limit;
            list = _.slice(list, start, stop)
        }else{
            list = await User.find().skip(params.offset - 1).limit(params.limit)
        }
        const orgIds = _.uniq(_.map(list, e => e.organization_id));
        const orgs = await Organization.find({_id: {$in: orgIds}});
        const orgInfoMap = _.keyBy(orgs, '_id');
        list = _.map(list, e => {
            const orgInfo = orgInfoMap[e.organization_id];
            return {
                phone: e.phone,
                orgInfo: {
                    name: orgInfo.name,
                    initialized: orgInfo.initialized,
                    corporationPhone: orgInfo.corporation_phone,
                    managerPhone: orgInfo.manager_phone,
                    bednum: orgInfo.bednum,
                    address: orgInfo.address,
                    level: orgInfo.level,
                    street: orgInfo.street,
                }
            }
        });
        res.status(200).send({code: 0, data: { list }, msg: '查询成功'});
    } catch (e) {
        let data = '';
        if(_.size(e.details) > 0) {
            _.each(e.details, item => {
                data += item.message;
            });
        }
        console.log(e)
        res.status(400).send({code: 5, data, msg: '修改失败'});
    }
};

exports.newUser = async function (req, res) {
    const user = req.user
    try {
        const initOrgInfo = await Joi.validate(req.body, initOrgInfoSchema);
        let orgInfo = await Organization.findById(user.organizationId)
        if (!orgInfo) {
            res.status(400).send({code: 5, msg: '用户所属机构信息错误,请联系管理员'});
            return
        }
        const updateInfo = {
            corporation_phone: initOrgInfo.corporationPhone,
            manager_phone: initOrgInfo.managerPhone,
            bednum: initOrgInfo.bednum,
            address: initOrgInfo.address,
            level: initOrgInfo.level,
            street: initOrgInfo.street,
        }
        await Organization.updateOne({_id: ObjectId(user.organizationId)}, updateInfo);
        res.status(200).send({code: 0, msg: '更新成功'});
    } catch (e) {
        console.log(e)
        res.status(400).send({code: 5, msg: '修改失败'});
    }
};

exports.resetPassword = async function (req, res) {
    try {
        if (!req.body.password || !req.body.newPassword || !req.body.verifyCode) {
            res.status(400).send({code: 5, msg: '缺少参数'});
            return
        }
        // if (req.session[req.admin && req.admin.phone] !== req.body.verifyCode) {
        //     res.status(200).send({code: 0, msg: '验证码已过期'});
        //     return
        // }
        Admin.findOne({
            phone: req.admin.phone
        }, function (err, admin) {
            if (err) throw err;
            if (!admin) {
                res.status(400).send({code: 5, msg: '更改密码失败'});
            } else {
                admin.comparePassword(req.body.password, function (err, isMatch) {
                    if (isMatch && !err) {
                        bcrypt.genSalt(10, function (err, salt) {
                            if (err) {
                                res.status(400).send({code: 5, msg: '更改密码失败'});
                                return
                            }
                            bcrypt.hash(req.body.newPassword, salt, null, function (err, hash) {
                                if (err) {
                                    res.status(400).send({code: 5, msg: '更改密码失败'});
                                    return
                                }
                                Admin.updateOne({_id: new ObjectId(req.admin.id)}, {password: hash}, function (err) {
                                    if (err) {
                                        res.status(400).send({code: 5, msg: '更改密码失败'});
                                        return
                                    }
                                    res.status(200).send({code: 5, msg: '更改密码成功'});
                                    
                                })
                            });
                        });
                    } else {
                        res.status(400).send({code: 5, msg: '旧密码错误'});
                    }
                });
            }
        });
    } catch (e) {
        console.log(e)
        res.status(400).send({code: 5, msg: '修改失败'});
    }
};

exports.updateUserInfo = async function (req, res) {
    const user = req.user
    try {
        const initOrgInfo = await Joi.validate(req.body, initOrgInfoSchema);
        let orgInfo = await Organization.findById(user.organizationId)
        if (!orgInfo) {
            res.status(400).send({code: 5, msg: '用户所属机构信息错误,请联系管理员'});
            return
        }
        const updateInfo = {
            corporation_phone: initOrgInfo.corporationPhone,
            manager_phone: initOrgInfo.managerPhone,
            bednum: initOrgInfo.bednum,
            address: initOrgInfo.address,
            level: initOrgInfo.level,
            street: initOrgInfo.street,
        }
        await Organization.updateOne({_id: ObjectId(user.organizationId)}, updateInfo);
        res.status(200).send({code: 0, msg: '更新成功'});
    } catch (e) {
        console.log(e)
        res.status(400).send({code: 5, msg: '修改失败'});
    }
};

exports.updateOrgInfo = async function (req, res) {
    const user = req.user
    try {
        const initOrgInfo = await Joi.validate(req.body, initOrgInfoSchema);
        let orgInfo = await Organization.findById(user.organizationId)
        if (!orgInfo) {
            res.status(400).send({code: 5, msg: '用户所属机构信息错误,请联系管理员'});
            return
        }
        const updateInfo = {
            corporation_phone: initOrgInfo.corporationPhone,
            manager_phone: initOrgInfo.managerPhone,
            bednum: initOrgInfo.bednum,
            address: initOrgInfo.address,
            level: initOrgInfo.level,
            street: initOrgInfo.street,
        }
        await Organization.updateOne({_id: ObjectId(user.organizationId)}, updateInfo);
        res.status(200).send({code: 0, msg: '更新成功'});
    } catch (e) {
        console.log(e)
        res.status(400).send({code: 5, msg: '修改失败'});
    }
};

exports.fetchReportSummay = async function (req, res) {
    const user = req.user
    try {
        const initOrgInfo = await Joi.validate(req.body, initOrgInfoSchema);
        let orgInfo = await Organization.findById(user.organizationId)
        if (!orgInfo) {
            res.status(400).send({code: 5, msg: '用户所属机构信息错误,请联系管理员'});
            return
        }
        const updateInfo = {
            corporation_phone: initOrgInfo.corporationPhone,
            manager_phone: initOrgInfo.managerPhone,
            bednum: initOrgInfo.bednum,
            address: initOrgInfo.address,
            level: initOrgInfo.level,
            street: initOrgInfo.street,
        }
        await Organization.updateOne({_id: ObjectId(user.organizationId)}, updateInfo);
        res.status(200).send({code: 0, msg: '更新成功'});
    } catch (e) {
        console.log(e)
        res.status(400).send({code: 5, msg: '修改失败'});
    }
};

exports.signup = function(req, res) {
    if (!req.body.phone || !req.body.password) {
        res.json({success: false, msg: 'Please pass phone,password .'});
    } else {
        let newAdmin = new Admin({
            phone: req.body.phone,
            password: req.body.password,
            authority: 3
        });
        newAdmin.save(function(err) {
            if (err) {
                return res.json({success: false, msg: 'phone already exists.'});
            }
            res.json({success: true, msg: 'Successful created new user.'});
        });
    }
};
