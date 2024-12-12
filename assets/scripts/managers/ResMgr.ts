
export default class ResMgr extends cc.Component {

    public static Ins: ResMgr = null;

    private m_abBunds: Map<string, cc.AssetManager.Bundle> = new Map<string, cc.AssetManager.Bundle>;

    /** 资源总数 */
    private m_total: number = 0;
    private m_now: number = 0;

    /** AB包总数 */
    private m_totalAB: number = 0;
    private m_nowAB: number = 0;

    private m_progressFunc: Function = null;
    private m_endFunc: Function = null;

    onLoad(): void {
        if (ResMgr.Ins === null) {
            ResMgr.Ins = this;
        } else {
            this.destroy();
            return;
        }
    }

    public getAsset(abName, resUrl): any {
        var bondule = cc.assetManager.getBundle(abName);
        if (bondule === null) {
            console.log("[error]: " + abName + " AssetsBundle not loaded !!!");
            return null;
        }
        return bondule.get(resUrl);
    }

    /**
     * 
     * @param resPkg { ab包名称: { type: cc.Prefab, urls: ["路径"] } }
     * @param progressFunc 加载中的回调
     * @param endFunc 加载结束回调
     */
    public preloadResPkg(resPkg, progressFunc, endFunc): void {
        this.m_total = 0;
        this.m_now = 0;

        this.m_totalAB = 0;
        this.m_nowAB = 0;

        this.m_progressFunc = progressFunc;
        this.m_endFunc = endFunc;

        for (var key in resPkg) {
            this.m_totalAB++;
            this.m_total += resPkg[key].urls.length;
        }

        for (var key in resPkg) {
            this.loadAssetsBundle(key, () => {
                this.m_nowAB++;
                if (this.m_nowAB === this.m_totalAB) {
                    this.loadAssetsInAssetsBundle(resPkg);
                }
            });

        }
    }

    /**
     * 加载Bundle
     * @param abName
     * @param endFunc 
     */
    private loadAssetsBundle(abName: string, endFunc: Function): void {
        cc.assetManager.loadBundle(abName, (err, bundle) => {
            if (err !== null) {
                console.log("[ResMgr]:Load AssetsBundle Error: " + abName);
                this.m_abBunds[abName] = null;
            } else {
                console.log("[ResMgr]:Load AssetsBundle Success: " + abName);
                this.m_abBunds[abName] = bundle;
            }
            if (endFunc) {
                endFunc();
            }
        });
    }

    private loadAssetsInAssetsBundle(resPkg): void {
        for (var key in resPkg) {
            var urlSet = resPkg[key].urls;
            var typeClass = resPkg[key].type;
            for (var i = 0; i < urlSet.length; i++) {
                this.loadRes(this.m_abBunds[key], urlSet[i], typeClass);
            }
        }
    }

    private loadRes(abBundle, url, typeClasss): void {
        abBundle.load(url, typeClasss, (error, asset) => {
            this.m_now++;
            if (error) {
                console.log("load Res " + url + " error: " + error);
            } else {
                console.log("load Res " + url + " success!");
            }

            if (this.m_progressFunc) {
                this.m_progressFunc(this.m_now, this.m_total);
            }

            if (this.m_now >= this.m_total) {
                if (this.m_endFunc !== null) {
                    this.m_endFunc();
                }
            }
        });
    }

}
