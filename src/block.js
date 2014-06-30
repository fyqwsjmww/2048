var Block;
Block = cc.Node.extend({
    block:null,
    level:1,

    Block:function(){
        this.block = cc.Sprite.create(s_Block1);
        this.block.setAnchorPoint(0,0);
        this.block.setPosition(0,0);
        this.addChild(this.block);
        this.setAnchorPoint(0,0);
    },

    changeValue:function(){
        this.level++;
        var texture;
        var textureCache = cc.TextureCache.getInstance();
        switch (this.level){
            case 2: texture = textureCache.addImage(s_Block2);break;
            case 3: texture = textureCache.addImage(s_Block3);break;
            case 4: texture = textureCache.addImage(s_Block4);break;
            case 5: texture = textureCache.addImage(s_Block5);break;
            case 6: texture = textureCache.addImage(s_Block6);break;
            case 7: texture = textureCache.addImage(s_Block7);break;
            case 8: texture = textureCache.addImage(s_Block8);break;
            case 9: texture = textureCache.addImage(s_Block9);break;
            case 10: texture = textureCache.addImage(s_Block10);break;
            case 11: texture = textureCache.addImage(s_Block11);break;
            default : break;
        }
        this.block.setTexture(texture);
        return(this.level == 11);
    },

    getValue:function(){
        return(Math.pow(2, this.level));
    }
})
