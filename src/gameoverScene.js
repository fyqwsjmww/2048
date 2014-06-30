var GameOverLayer;
GameOverLayer = cc.Layer.extend({

    init:function(score){
        var size = cc.Director.getInstance().getVisibleSize();

        var bglayer = cc.LayerColor.create(cc.c4b(247,248,232,255));
        bglayer.setAnchorPoint(0, 0);
        bglayer.setPosition(0, 0);
        this.addChild(bglayer);

        var label1 = cc.LabelTTF.create("Game Over", "Impact", 60);
        label1.setColor(cc.c3b(0, 0, 0));
        label1.setPosition(size.width / 2, size.height * 2 / 3);
        this.addChild(label1);

        var label2 = cc.LabelTTF.create("Score", "Impact", 48);
        label2.setColor(cc.c3b(0, 0, 0));
        label2.setPosition(size.width / 2, size.height / 2);
        this.addChild(label2);

        var scoreLabel = cc.LabelTTF.create(score.toString(), "Impact", 48);
        scoreLabel.setColor(cc.c3b(0, 0, 0));
        scoreLabel.setPosition(size.width / 2, size.height / 3);
        this.addChild(scoreLabel);

        var replayButton = cc.MenuItemImage.create(
            s_ReplayGame,
            s_ReplayGame,
            this.replay,
            this);
        replayButton.setAnchorPoint(0.5, 0.5);

        var menu = cc.Menu.create(replayButton);
        menu.setPosition(0, 0);
        this.addChild(menu, 1);
        replayButton.setPosition(size.width / 2, size.height / 8);
    },

    replay:function(){
        var myscene = new MyScene();
        cc.Director.getInstance().replaceScene(myscene);
    }
});

var GameOverScene = cc.Scene.extend({
    gameoverlayer:null,
    onEnter:function(){
        this._super();

        this.addChild(this.gameoverlayer);
    },

    initLayerWithScore:function(score){
        this.gameoverlayer = new GameOverLayer();
        this.gameoverlayer.init(score);
    }
});