var Panel;
Panel = cc.Node.extend({
    blockFlag:null,
    blockPosition:null,
    score:0,
    panel: null,

    Panel:function(){
        var director = cc.Director.getInstance();
        var size = director.getVisibleSize();
        var border = 11;
        var length = 94 + border;

        this.panel = cc.Sprite.create(s_Panel);
        this.panel.setAnchorPoint(0.5, 0.5);
        this.panel.setPosition(size.width / 2, size.height / 2);
        this.addChild(this.panel, 0);

        var marginLeft =(size.width - this.panel.getContentSize().width )/ 2 + border;
        var marginBottom =(size.height - this.panel.getContentSize().height )/ 2 + border;

        this.blockFlag = new Array();
        this.blockPosition = new Array();
        for(var i = 0; i < 4; i++){
            this.blockFlag[i] = new Array();
            this.blockPosition[i] = new Array();
            for(var j = 0; j < 4; j++){
                this.blockFlag[i][j] = false;
                this.blockPosition[i][j] = cc.p(marginLeft + length * j, marginBottom + length * i);
            }
        }
        this.addBlock();
        this.addBlock();
    },

    addBlock:function(){
        var count = 0;
        for(var i = 0; i < 4; i++){
            for(var j = 0; j < 4; j++){
                if(!this.blockFlag[i][j]){
                    count++;
                }
            }
        }
        if(count == 0){
            return false;
        }
        var position = Math.floor(Math.random() * count);
        for(i = 0; i < 16; i++){
            if(!this.blockFlag[Math.floor(i / 4)][i % 4]){
                if(position == 0){
                    this.blockFlag[Math.floor(i / 4)][i % 4] = true;
                    //var block = cc.Sprite.create(s_Block1);
                    var block = new Block();
                    block.Block();
                    block.setTag(i);
                    block.setPosition(this.blockPosition[Math.floor(i / 4)][i % 4]);
                    this.addChild(block, 1);
                    break;
                }
                position--;
            }
        }
        return true;
    },

    getScore:function(){
        return this.score;
    },

    moveAction: function(sp, point){
        var moveto = cc.MoveTo.create(0.1, point);
        var action_move = cc.Spawn.create(moveto, null);
        sp.runAction(action_move);
    },

    //0, 1, 2, 3 上下右左
    move:function(dir){
        cc.AudioEngine.getInstance().playEffect(s_move, false);
        switch (dir){
            case 0:this.moveUp();break;
            case 1:this.moveDown();break;
            case 2:this.moveRight();break;
            case 3:this.moveLeft();break;
            default :break;
        }
        return(this.addBlock());
    },

    moveUp:function(){
        var y;
        var next_y;
        var prev_value;
        var prev_tag;

        for(var x = 0; x < 4; x++){
            y = 3;
            next_y = 3;
            prev_tag = -1;
            prev_value = 0;

            while(y >= 0){

                while( y >= 0 && !this.blockFlag[y][x]){
                    y--;
                }

                if(y >= 0){
                    var block = this.getChildByTag(y * 4 + x);

                    if(block.getValue() == prev_value && prev_tag != -1){
                        this.combine(prev_tag);
                        this.score += block.getValue();
                        this.moveAction(block, this.blockPosition[next_y + 1][x]);
                        this.removeChildByTag(y * 4 + x);
                        this.blockFlag[y][x] = false;
                        prev_tag = -1;
                    }

                    else{
                        prev_tag = next_y * 4 + x;
                        block.setTag(prev_tag);
                        this.moveAction(block, this.blockPosition[next_y][x]);
                        prev_value = block.getValue();
                        this.blockFlag[y][x] = false;
                        this.blockFlag[next_y][x] = true;
                        next_y--;
                    }

                    y--;
                }
            }
        }
    },

    moveDown:function(){
        var y;
        var next_y;
        var prev_value;
        var prev_tag;

        for(var x = 0; x < 4; x++){
            y = 0;
            next_y = 0;
            prev_tag = -1;
            prev_value = 0;

            while(y < 4){

                while(y < 4 && !this.blockFlag[y][x]){
                    console.log("%d,%d:%s", y, x, this.blockFlag[y][x]);
                    y++;
                }

                if(y < 4){
                    var block = this.getChildByTag(y * 4 + x);

                    if(block.getValue() == prev_value && prev_tag != -1){
                        this.combine(prev_tag);
                        this.score += block.getValue();
                        this.moveAction(block, this.blockPosition[next_y - 1][x]);
                        this.removeChildByTag(y * 4 + x);
                        this.blockFlag[y][x] = false;
                        prev_tag = -1;
                    }

                    else{
                        prev_tag = next_y * 4 + x;
                        block.setTag(prev_tag);
                        this.moveAction(block, this.blockPosition[next_y][x]);
                        prev_value = block.getValue();
                        this.blockFlag[y][x] = false;
                        this.blockFlag[next_y][x] = true;
                        next_y++;
                    }

                    y++;
                }
            }
        }
    },

    moveRight:function(){
        var x;
        var next_x;
        var prev_value;
        var prev_tag;

        for(var y = 0; y < 4; y++){
            x = 3;
            next_x = 3;
            prev_tag = -1;
            prev_value = 0;

            while(x >= 0){

                while(!this.blockFlag[y][x] && x >= 0){
                    x--;
                }

                if(x >= 0){
                    var block = this.getChildByTag(y * 4 + x);

                    if(block.getValue() == prev_value && prev_tag != -1){
                        this.combine(prev_tag);
                        this.score += block.getValue();
                        this.moveAction(block, this.blockPosition[y][next_x + 1]);
                        this.removeChildByTag(y * 4 + x);
                        this.blockFlag[y][x] = false;
                        prev_tag = -1;
                    }

                    else{
                        prev_tag = y * 4 + next_x;
                        block.setTag(prev_tag);
                        this.moveAction(block, this.blockPosition[y][next_x]);
                        prev_value = block.getValue();
                        this.blockFlag[y][x] = false;
                        this.blockFlag[y][next_x] = true;
                        next_x--;
                    }

                    x--;
                }
            }
        }
    },

    moveLeft:function(){
        var x;
        var next_x;
        var prev_value;
        var prev_tag;

        for(var y = 0; y < 4; y++){
            x = 0;
            next_x = 0;
            prev_tag = -1;
            prev_value = 0;

            while(x < 4){

                while(!this.blockFlag[y][x] && x < 4){
                    x++;
                }

                if(x < 4){
                    var block = this.getChildByTag(y * 4 + x);

                    if(block.getValue() == prev_value && prev_tag != -1){
                        this.combine(prev_tag);
                        this.score += block.getValue();
                        this.moveAction(block, this.blockPosition[y][next_x - 1]);
                        this.removeChildByTag(y * 4 + x);
                        this.blockFlag[y][x] = false;
                        prev_tag = -1;
                    }

                    else{
                        prev_tag = y * 4 + next_x;
                        block.setTag(prev_tag);
                        this.moveAction(block, this.blockPosition[y][next_x]);
                        prev_value = block.getValue();
                        this.blockFlag[y][x] = false;
                        this.blockFlag[y][next_x] = true;
                        next_x++;
                    }

                    x++;
                }
            }
        }
    },

    combine:function(tag){
        var block = this.getChildByTag(tag);
        cc.AudioEngine.getInstance().playEffect(s_combine,false);
        return(block.changeValue());
    }
});
