import * as PIXI from "pixi.js";
import * as PIXISpine from "@pixi/spine-pixi";

export class Spine
{
    public spine!: PIXISpine.Spine;

    async initialize(spineData: string): Promise<void>
    {
        const dataAlias = spineData + "Data";
        const atlasAlias = spineData + "Atlas";
        
        if (!PIXI.Assets.cache.has(dataAlias)) {
            PIXI.Assets.add({ alias: dataAlias, src: "assets/spines/" + spineData + ".json" });
        }
        if (!PIXI.Assets.cache.has(atlasAlias)) {
            PIXI.Assets.add({ alias: atlasAlias, src: "assets/spines/" + spineData + ".atlas" });
        }
        
        await PIXI.Assets.load([dataAlias, atlasAlias]);
    
        this.spine = PIXISpine.Spine.from({
            atlas: atlasAlias,
            skeleton: dataAlias,
            scale: 1,
        });
        
        this.spine.state.data.defaultMix = 0.2;
        this.spine.x = 0;
        this.spine.y = 0;
    }

    setSkin(skinName: string): void
    {
        const { spine } = this;
        const skin = spine.skeleton.data.findSkin(skinName);
        if (skin) {
            spine.skeleton.setSkin(skin);
            spine.skeleton.setSlotsToSetupPose();
        } else {
            console.warn(`Skin "${skinName}" not found in spine data`);
        }
    }
}