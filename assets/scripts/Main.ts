// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

import ResConfig from "./configs/ResConfig";
import ResMgr from "./managers/ResMgr";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Main extends cc.Component {

    @property(cc.Sprite)
    progressValue: cc.Sprite = null;

    onLoad() {
        this.progressValue.fillRange = 0;

        this.node.addComponent(ResMgr);
    }

    start() {
        ResMgr.Ins.preloadResPkg(ResConfig, (now, total) => {
            console.log("now : ", now);
            console.log("total : ", total);
            this.progressValue.fillRange = now / total;
        }, () => {
            console.log("资源加载完成");
        });
    }

    update(dt) {

    }

}
