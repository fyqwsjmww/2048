/****************************************************************************
 Copyright (c) 2010-2012 cocos2d-x.org
 Copyright (c) 2008-2010 Ricardo Quesada
 Copyright (c) 2011      Zynga Inc.

 http://www.cocos2d-x.org

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 ****************************************************************************/

var MyLayer;
MyLayer = cc.Layer.extend({
    isMouseDown: false,
    helloLabel: null,
    firstX:0,
    firstY:0,
    endX:0,
    endY:0,
    panel:null,
    pScore:null,

    init: function () {

        //////////////////////////////
        // 1. super init first
        this._super();
        var director = cc.Director.getInstance();
        var size = director.getVisibleSize();

        //设置一张纯色背景
        var bglayer = cc.LayerColor.create(cc.c4b(247,248,232,255));
        bglayer.setAnchorPoint(0, 0);
        bglayer.setPosition(0, 0);
        this.addChild(bglayer);

        //重玩按钮
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

        //设置为响应点击
        this.setKeyboardEnabled(true);
        this.setTouchEnabled(true);
        director.getTouchDispatcher()._addTargetedDelegate(this, -127, true);

        //添加分数文字
        this.helloLabel = cc.LabelTTF.create("score", "Impact", 48);
        this.helloLabel.setColor(cc.c3b(0, 0, 0));
        // position the label on the center of the screen
        this.helloLabel.setPosition(size.width / 2, size.height - this.helloLabel.getContentSize().height);
        // add the label as a child to this layer
        this.addChild(this.helloLabel, 5);

        //开始一局游戏
        this.setAGame();
    },

    setAGame: function(){
        var director = cc.Director.getInstance();
        var size = director.getVisibleSize();

        //实例化一个嵌板
        this.panel = new Panel();
        this.panel.Panel();
        this.panel.setTag(1);
        this.addChild(this.panel);

        //实例化一个分数板
        var score = this.panel.getScore();
        this.pScore = cc.LabelTTF.create(score.toString(), "Impact", 48);
        this.pScore.setColor(cc.c3b(0,0,0));
        this.pScore.setPosition(size.width / 2, size.height - 120);
        this.pScore.setTag(2);
        this.addChild(this.pScore);
    },

    replay:function(){
        //重玩逻辑。移除现在的嵌板与分数板，重现添加新的实例
        this.removeChildByTag(1);
        this.removeChildByTag(2);
        this.setAGame();
    },

    //点击响应的逻辑
    onTouchBegan:function(touch, event){
        this.firstX = touch.getLocation().x;
        this.firstY = touch.getLocation().y;
        return true;
    },

    onTouchEnded:function(touch, event){
        this.endX = touch.getLocation().x;
        this.endY = touch.getLocation().y;
        var lengthX = this.endX - this.firstX;
        var lengthY = this.endY - this.firstY;
        var flag = false;
        //设置为大于30是为了把用户极短距离的移动视为误操作
        if(Math.abs(lengthX) > Math.abs(lengthY)){
            if(lengthX > 30){
                flag = this.panel.move(2);//右
                this.gameover(flag);
            }
            else if(lengthX < -30){
                flag = this.panel.move(3);//左
                this.gameover(flag);
            }
        }
        else{
            if(lengthY > 30){
                flag = this.panel.move(0);//上
                this.gameover(flag);
            }
            else if(lengthY < -30){
                flag = this.panel.move(1);//下
                this.gameover(flag);
            }
        }
        return true;
    },

    onKeyDown:function(keyCode){
        if(keyCode == cc.KEY.left){
            flag = this.panel.move(3);//左
            this.gameover(flag);
        }
        if(keyCode == cc.KEY.right){
            flag = this.panel.move(2);//右
            this.gameover(flag);
        }
        if(keyCode == cc.KEY.up){
            flag = this.panel.move(0);//上
            this.gameover(flag);
        }
        if(keyCode == cc.KEY.down){
            flag = this.panel.move(1);//下
            this.gameover(flag);
        }
    },

    gameover:function(flag){
        //如果还能移动，说明游戏还没有结束
        if(flag){
            var score = this.panel.getScore();
            this.pScore.setString(score.toString());
        }
        else{
            //游戏结束，新建游戏结束场景
            var gameoverScene = new GameOverScene();
            gameoverScene.initLayerWithScore(this.panel.getScore());
            cc.Director.getInstance().replaceScene(gameoverScene);
        }
    }
});

var MyScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var layer = new MyLayer();
        this.addChild(layer);
        layer.init();
    }
});
