let _ = require('lodash');

let domesticDaily = require("../models/DomesticGarbageDaily");
let barrelDutyMonthly = require("../models/BarrelDutyMonthly");
let domesticMonthly = require("../models/DomesticGarbageMonthly");
let domesticWeekly = require("../models/DomesticGarbageWeekly");
let medicMonthly = require("../models/MedicGarbageMonthly");
let Organization = require("../models/Organization");

let DomesticGarbageDailySummary = require('../models/DomesticGarbageDailySummary');
let DomesticGarbageWeeklySummary = require('../models/DomesticGarbageWeeklySummary');
let DomesticGarbageMonthlySummary = require('../models/DomesticGarbageMonthlySummary');
let BarrelDutyMonthlySummary = require('../models/BarrelDutyMonthlySummary');
let MedicGarbageMonthlySummary = require('../models/MedicGarbageMonthlySummary');

let DomesticGarbageDaily = require('../models/DomesticGarbageDaily');
let DomesticGarbageWeekly = require('../models/DomesticGarbageWeekly');
let DomesticGarbageMonthly = require('../models/DomesticGarbageMonthly');
let MedicGarbageMonthly = require('../models/MedicGarbageMonthly');
let BarrelDutyMonthly = require('../models/BarrelDutyMonthly');

const Joi = require('joi');

const summitDomDailySchema = {
    time: Joi.date().required(),
    
    meetingTimes: Joi.number().integer().required(),
    meetingHost: Joi.string().required(),
    meetingContent: Joi.string().required(),
    
    selfTimes: Joi.number().integer().required(),
    selfProblems: Joi.number().integer().required(),
    selfContent: Joi.string().required(),
    selfCorrected: Joi.boolean().required(),
    
    advertiseTimes: Joi.number().integer().required(),
    advertiseContent: Joi.string().required(),
    
    traningTimes: Joi.number().integer().required(),
    trainees: Joi.number().integer().required(),
    traningContent: Joi.string().required(),
    
    govTimes: Joi.number().integer().required(),
    govProblems: Joi.number().integer().required(),
    govContent: Joi.string().required(),
    govCorrected: Joi.boolean().required(),
}

exports.summitDomDaily = async function (req, res) {
    const user = req.user
    if (!user.organizationId) {
        res.status(400).send({code: 5, msg: '用户所属机构信息错误,请联系管理员'});
        return
    }
    try {
        const domDailyInfo = await Joi.validate(req.body, summitDomDailySchema);
        let orgInfo = await Organization.findOne({_id:user.organizationId});
        if(!orgInfo){
            res.status(400).send({code: 5, msg: '用户机构信息错误'});
            return
        }
        let updateInfo = {
            time: domDailyInfo.time.getTime(),
            user_id: user.id,
            organization_id: user.organizationId,
            type: orgInfo.type,
            level: orgInfo.level,
            
            meeting_times: domDailyInfo.meetingTimes,
            meeting_host: domDailyInfo.meetingHost,
            meeting_content: domDailyInfo.meetingContent,
            
            self_inspection_times: domDailyInfo.selfTimes,
            self_inspection_problems: domDailyInfo.selfProblems,
            self_inspection_content: domDailyInfo.selfContent,
            self_inspection_corrected: domDailyInfo.selfCorrected,
            
            advertise_times: domDailyInfo.advertiseTimes,
            advertise_content: domDailyInfo.advertiseContent,
            
            traning_times: domDailyInfo.traningTimes,
            trainees: domDailyInfo.trainees,
            traning_content: domDailyInfo.traningContent,
            
            gov_inspection_times: domDailyInfo.govTimes,
            gov_inspection_problems: domDailyInfo.govProblems,
            gov_inspection_content: domDailyInfo.govContent,
            gov_inspection_corrected: domDailyInfo.govCorrected,
        };
        await domesticDaily.updateOne({
            time: domDailyInfo.time.getTime(),
            organization_id: user.organizationId
        }, updateInfo, {upsert: true});
        
        let result = await DomesticGarbageDailySummary.findOne({time: domDailyInfo.time.getTime()});
        if (result) {
            await DomesticGarbageDailySummary.updateOne({
                time: domDailyInfo.time.getTime()
            }, {is_expired: true});
        }
        res.status(200).send({code: 0, msg: '提交成功'});
    } catch (e) {
        let data = '';
        if (_.size(e.details) > 0) {
            _.each(e.details, item => {
                data += item.message;
            });
        }
        console.log(e);
        res.status(400).send({code: 5, data, msg: '提交失败'});
    }
};

const summitDomWeeklySchema = {
    time: Joi.date().required(),
    
    consignee: Joi.number().required(),
    guide: Joi.number().required(),
    inspector: Joi.number().required(),
    kitchenWasteCollectors: Joi.number().required(),
    kitchenWastePositions: Joi.number().required(),
    recyclableWasteCollectors: Joi.number().required(),
    recyclableWastePositions: Joi.number().required(),
    harmfulWasteCollectors: Joi.number().required(),
    harmfulWastePositions: Joi.number().required(),
    otherWasteCollectors: Joi.number().required(),
    otherWastePositions: Joi.number().required(),
    medicWasteCollectors: Joi.number().required(),
    medicWastePositions: Joi.number().required(),
    bulkyWastePositions: Joi.number().required(),
    kitchenWaste: Joi.number().required(),
    recyclableWaste: Joi.number().required(),
    harmfulWaste: Joi.number().required(),
    otherWaste: Joi.number().required(),
    medicWaste: Joi.number().required(),
}

exports.summitDomWeekly = async function (req, res) {
    const user = req.user
    if (!user.organizationId) {
        res.status(400).send({code: 5, msg: '用户所属机构信息错误,请联系管理员'});
        return
    }
    try {
        const domWeeklyInfo = await Joi.validate(req.body, summitDomWeeklySchema);
        let orgInfo = await Organization.findOne({_id:user.organizationId});
        if(!orgInfo){
            res.status(400).send({code: 5, msg: '用户机构信息错误'});
            return
        }
        let updateInfo = {
            time: domWeeklyInfo.time.getTime(),
            user_id: user.id,
            organization_id: user.organizationId,
            type: orgInfo.type,
            level: orgInfo.level,
            consignee: domWeeklyInfo.consignee,
            guide: domWeeklyInfo.guide,
            inspector: domWeeklyInfo.inspector,
            kitchen_waste_collectors: domWeeklyInfo.kitchenWasteCollectors,
            kitchen_waste_positons: domWeeklyInfo.kitchenWastePositions,
            recyclable_waste_collectors: domWeeklyInfo.recyclableWasteCollectors,
            recyclable_waste_positons: domWeeklyInfo.recyclableWastePositions,
            harmful_waste_collectors: domWeeklyInfo.harmfulWasteCollectors,
            harmful_waste_positons: domWeeklyInfo.harmfulWastePositions,
            other_waste_collectors: domWeeklyInfo.otherWasteCollectors,
            other_waste_positons: domWeeklyInfo.otherWastePositions,
            medic_waste_collectors: domWeeklyInfo.medicWasteCollectors,
            medic_waste_positons: domWeeklyInfo.medicWastePositions,
            bulky_waste_positons: domWeeklyInfo.bulkyWastePositions,
            kitchen_waste: domWeeklyInfo.kitchenWaste,
            recyclable_waste: domWeeklyInfo.recyclableWaste,
            harmful_waste: domWeeklyInfo.harmfulWaste,
            other_waste: domWeeklyInfo.otherWaste,
            medic_waste: domWeeklyInfo.medicWaste,
        };
        await domesticWeekly.updateOne({
            time: domWeeklyInfo.time.getTime(),
            organization_id: user.organizationId
        }, updateInfo, {upsert: true});
        let result = await DomesticGarbageWeeklySummary.findOne({time: domWeeklyInfo.time.getTime()});
        if (result) {
            await DomesticGarbageWeeklySummary.updateOne({
                time: domWeeklyInfo.time.getTime()
            }, {is_expired: true});
        }
        res.status(200).send({code: 0, msg: '提交成功'});
    } catch (e) {
        let data = '';
        if (_.size(e.details) > 0) {
            _.each(e.details, item => {
                data += item.message;
            });
        }
        console.log(e);
        res.status(400).send({code: 5, data, msg: '提交失败'});
    }
};

const summitDomMonthlySchema = {
    time: Joi.date().required(),
    kitchenWaste: Joi.number().required(),
    recyclableWaste: Joi.number().required(),
    harmfulWaste: Joi.number().required(),
    bulkyWaste: Joi.number().required(),
    otherWaste: Joi.number().required(),
}

exports.summitDomMonthly = async function (req, res) {
    const user = req.user
    if (!user.organizationId) {
        res.status(400).send({code: 5, msg: '用户所属机构信息错误,请联系管理员'});
        return
    }
    try {
        const domMonthlyInfo = await Joi.validate(req.body, summitDomMonthlySchema);
        let orgInfo = await Organization.findOne({_id:user.organizationId});
        if(!orgInfo){
            res.status(400).send({code: 5, msg: '用户机构信息错误'});
            return
        }
        let existed = await domesticMonthly.findOne({
            time: domMonthlyInfo.time.getTime(),
            organization_id: user.organizationId
        });
        if(existed){
            const updateInfo = {};
            if(domMonthlyInfo.kitchenWaste) updateInfo.kitchen_waste = domMonthlyInfo.kitchenWaste;
            if(domMonthlyInfo.recyclableWaste) updateInfo.recyclable_waste = domMonthlyInfo.recyclableWaste;
            if(domMonthlyInfo.harmfulWaste) updateInfo.harmful_waste = domMonthlyInfo.harmfulWaste;
            if(domMonthlyInfo.bulkyWaste) updateInfo.bulky_waste = domMonthlyInfo.bulkyWaste;
            if(domMonthlyInfo.otherWaste) updateInfo.other_waste = domMonthlyInfo.otherWaste;
            await domesticMonthly.updateOne({
                time: domMonthlyInfo.time.getTime(),
                organization_id: user.organizationId
            }, updateInfo, {upsert: true});
        }else {
            let newDomesticMonthly = new domesticMonthly({
                time: domMonthlyInfo.time.getTime(),
                user_id: user.id,
                organization_id: user.organizationId,
                type: orgInfo.type,
                level: orgInfo.level,
                kitchen_waste: domMonthlyInfo.kitchenWaste,
                recyclable_waste: domMonthlyInfo.recyclableWaste,
                harmful_waste: domMonthlyInfo.harmfulWaste,
                bulky_waste: domMonthlyInfo.bulkyWaste,
                other_waste: domMonthlyInfo.otherWaste,
            });
            await newDomesticMonthly.save();
        }
        
        let result = await DomesticGarbageMonthlySummary.findOne({time: domMonthlyInfo.time.getTime()});
        if (result) {
            await DomesticGarbageMonthlySummary.updateOne({
                time: domMonthlyInfo.time.getTime()
            }, {is_expired: true});
        }
        res.status(200).send({code: 0, msg: '提交成功'});
    } catch (e) {
        let data = '';
        if (_.size(e.details) > 0) {
            _.each(e.details, item => {
                data += item.message;
            });
        }
        console.log(e);
        res.status(400).send({code: 5, data, msg: '提交失败'});
    }
};

const summitBarrelMonthlySchema = {
    time: Joi.date().required(),
    personCountOnDuty: Joi.number().required(),
}

exports.summitBarrelMonthly = async function (req, res) {
    const user = req.user;
    if (!user.organizationId) {
        res.status(400).send({code: 5, msg: '用户所属机构信息错误,请联系管理员'});
        return
    }
    try {
        const barrelMonthlyInfo = await Joi.validate(req.body, summitBarrelMonthlySchema);
        let orgInfo = await Organization.findOne({_id:user.organizationId});
        if(!orgInfo){
            res.status(400).send({code: 5, msg: '用户机构信息错误'});
            return
        }
        let existed = await barrelDutyMonthly.findOne({
            time: barrelMonthlyInfo.time.getTime(),
            organization_id: user.organizationId
        });
        if(existed){
            const updateInfo = {};
            if(barrelMonthlyInfo.personCountOnDuty) updateInfo.person_count_on_duty = barrelMonthlyInfo.personCountOnDuty;
            await barrelDutyMonthly.updateOne({
                time: barrelMonthlyInfo.time.getTime(),
                organization_id: user.organizationId
            }, updateInfo, {upsert: true});
        }else {
            let newBarrelDutyMonthly = new barrelDutyMonthly({
                time: barrelMonthlyInfo.time.getTime(),
                user_id: user.id,
                organization_id: user.organizationId,
                type: orgInfo.type,
                level: orgInfo.level,
                person_count_on_duty: barrelMonthlyInfo.personCountOnDuty
            });
            await newBarrelDutyMonthly.save();
        }
        
        let result = await BarrelDutyMonthlySummary.findOne({time: barrelMonthlyInfo.time.getTime()});
        if (result) {
            await BarrelDutyMonthlySummary.updateOne({
                time: barrelMonthlyInfo.time.getTime()
            }, {is_expired: true});
        }
        res.status(200).send({code: 0, msg: '提交成功'});
    } catch (e) {
        let data = '';
        if (_.size(e.details) > 0) {
            _.each(e.details, item => {
                data += item.message;
            });
        }
        console.log(e);
        res.status(400).send({code: 5, data, msg: '提交失败'});
    }
};

const summitMedMonthlySchema = {
    time: Joi.date().required(),
    totalWeight: Joi.number().required(),
};

exports.summitMedMonthly = async function (req, res) {
    const user = req.user;
    if (!user.organizationId) {
        res.status(400).send({code: 5, msg: '用户所属机构信息错误,请联系管理员'});
        return
    }
    try {
        const medMonthlyInfo = await Joi.validate(req.body, summitMedMonthlySchema);
        
        let orgInfo = await Organization.findOne({_id:user.organizationId});
        if(!orgInfo){
            res.status(400).send({code: 5, msg: '用户机构信息错误'});
            return
        }
        
        let updateInfo = {
            time: medMonthlyInfo.time.getTime(),
            user_id: user.id,
            organization_id: user.organizationId,
            type: orgInfo.type,
            level: orgInfo.level,
            total_weight: medMonthlyInfo.totalWeight,
        };
        await medicMonthly.updateOne({
            time: medMonthlyInfo.time.getTime(),
            organization_id: user.organizationId
        }, updateInfo, {upsert: true});
        let result = await MedicGarbageMonthlySummary.findOne({time: medMonthlyInfo.time.getTime()});
        if (result) {
            await MedicGarbageMonthlySummary.updateOne({
                time: medMonthlyInfo.time.getTime()
            }, {is_expired: true});
        }
        res.status(200).send({code: 0, msg: '提交成功'});
    } catch (e) {
        let data = '';
        if (_.size(e.details) > 0) {
            _.each(e.details, item => {
                data += item.message;
            });
        }
        console.log(e);
        res.status(400).send({code: 5, data, msg: '提交失败'});
    }
};

const fetchReportHistorySchema = {
    type: Joi.string().required()
};

exports.fetchReportHistory = async function (req, res) {
    const user = req.user;
    if (!user.organizationId) {
        res.status(400).send({code: 5, msg: '用户所属机构信息错误,请联系管理员'});
        return
    }
    try {
        const fetchReportHistoryInfo = await Joi.validate(req.body, fetchReportHistorySchema);
        let list = [];
        switch (fetchReportHistoryInfo.type) {
            case '1':
                list = await DomesticGarbageDaily.find({organization_id:user.organizationId});
                break;
            case '2':
                list = await DomesticGarbageWeekly.find({organization_id:user.organizationId});
                break;
            case '3':
                list = await DomesticGarbageMonthly.find({organization_id:user.organizationId});
                break;
            case '4':
                list = await MedicGarbageMonthly.find({organization_id:user.organizationId});
                break;
            case '5':
                list = await BarrelDutyMonthly.find({organization_id:user.organizationId});
                break;
            default:
        }
        res.status(200).send({code: 0, data: list, msg: '提交成功'});
    } catch (e) {
        let data = '';
        if (_.size(e.details) > 0) {
            _.each(e.details, item => {
                data += item.message;
            });
        }
        console.log(e);
        res.status(400).send({code: 5, data, msg: '提交失败'});
    }
};

