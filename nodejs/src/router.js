import duoduo from "./spider/video/duoduo.js";
import baseset from "./spider/video/baseset.js";
import mogg from "./spider/video/mogg.js";
import leijing from "./spider/video/leijing.js";
import panta from "./spider/video/panta.js";
import wogg from "./spider/video/wogg.js";
import zhizhen from "./spider/video/zhizhen.js";
import tgsou from "./spider/video/tgsou.js";
import tgchannel from "./spider/video/tgchannel.js";
import douban from "./spider/video/douban.js";
import push from "./spider/video/push.js";
import {getCache} from "./website/sites.js";
import _360ba from "./spider/video/_360ba.js";
import qq from "./spider/video/qq.js";
import iqiyi from "./spider/video/iqiyi.js";
import symx from "./spider/video/symx.js";
import syjc from "./spider/video/qq.js";
import m3u8cj from "./spider/video/m3u8cj.js";
import lives from "./spider/video/lives.js";
import jieyingshi from "./spider/video/jieyingshi.js";
import jianpian from "./spider/video/jianpian.js";
import fenmei_live from "./spider/video/fenmei_live.js";
import huya from "./spider/video/huya.js";
import douyu from "./spider/video/douyu.js";
import cntv from "./spider/video/cntv.js";
import bili from "./spider/video/bili.js";
import appys from "./spider/video/appys.js";

常数 蜘蛛 = [豆瓣, 多铎, mogg, 井磊, 潘塔, wogg, 至真, tgchannel, tgsou, 基本集, 推];
常数 蜘蛛前缀 = /蜘蛛;

/**
*初始化路由器的功能。
 *
* @ param { Object } Fastify-Fastify实例
* @return {Promise<void>} -路由器初始化时解析的承诺
 */
出口 系统默认值 异步ˌ非同步(asynchronous) 功能 路由器(fastify) {
    //注册所有蜘蛛路由器
    蜘蛛.为每一个((蜘蛛；状似蜘蛛的物体；星形轮；十字叉；连接柄；十字头) => {
        常数 小路 = 蜘蛛前缀 + '/' + 蜘蛛；状似蜘蛛的物体；星形轮；十字叉；连接柄；十字头.自指的.键 + '/' + 蜘蛛；状似蜘蛛的物体；星形轮；十字叉；连接柄；十字头.自指的.类型;
        fastify.注册(蜘蛛；状似蜘蛛的物体；星形轮；十字叉；连接柄；十字头.美国石油学会(American Petroleum Institute), { 前缀: 小路 });
        蜘蛛；状似蜘蛛的物体；星形轮；十字叉；连接柄；十字头.支票?.(fastify)
        安慰.原木(注册蜘蛛: ' + 小路);
    });
    /**
* @api {get} /check检查
     */
    fastify.注册(
        /**
         *
         * @param {import('fastify').FastifyInstance} fastify
         */
        async (fastify) => {
            fastify.get(
                '/check',
                /**
                 * check api alive or not
                 * @param {import('fastify').FastifyRequest} _request
                 * @param {import('fastify').FastifyReply} reply
                 */
                async function (_request, reply) {
                    reply.send({ run: !fastify.stop });
                }
            );
            const getConfig = () => {
                const config = {
                    video: {
                        sites: [],
                    },
                    read: {
                        sites: [],
                    },
                    comic: {
                        sites: [],
                    },
                    music: {
                        sites: [],
                    },
                    pan: {
                        sites: [],
                    },
                    color: fastify.config.color || [],
                };
                spiders.forEach((spider) => {
                    let meta = Object.assign({}, spider.meta);
                    meta.api = spiderPrefix + '/' + meta.key + '/' + meta.type;
                    meta.key = 'nodejs_' + meta.key;
                    const stype = spider.meta.type;
                    if (stype < 10) {
                        config.video.sites.push(meta);
                    } else if (stype >= 10 && stype < 20) {
                        config.read.sites.push(meta);
                    } else if (stype >= 20 && stype < 30) {
                        config.comic.sites.push(meta);
                    } else if (stype >= 30 && stype < 40) {
                        config.music.sites.push(meta);
                    } else if (stype >= 40 && stype < 50) {
                        config.pan.sites.push(meta);
                    }
                });
                return config
            }
            fastify.get(
                '/config',
                /**
                 * get catopen format config
                 * @param {import('fastify').FastifyRequest} _request
                 * @param {import('fastify').FastifyReply} reply
                 */
                async function (_request, reply) {
                    const config = getConfig()
                    const sites = await getCache(_request.server)

                    const allSites = config.video.sites
                    const visitedMap = {}
                    const allSitesMap = {}
                    allSites.forEach(site => {
                        allSitesMap[site.key] = site
                    })
                    // 旧的取出来 过滤掉已失效的
                    const rs =[]
                    sites.forEach(site => {
                        visitedMap[site.key] = true
                        if (allSitesMap[site.key] && site.enable) {
                            rs.push(allSitesMap[site.key])
                        }
                    })
                    // 如果有新的站源 则追加到后面 默认启用
                    allSites.forEach(site => {
                        if (!visitedMap[site.key]) {
                            rs.push(site)
                        }
                    })
                    config.video.sites = rs

                    reply.send(config);
                }
            );
            fastify.get('/full-config', (_, reply) => {
                const config = getConfig()
                reply.send(config);
            })
        }
    );
}
