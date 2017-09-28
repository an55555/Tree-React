import React, { Component } from 'react';
import  './com-style/slide.css';
import './App.css';

function GetRandomNumFn(Min,Max){
    var Range = Max - Min;
    var Rand = Math.random();
    return(Min + Math.round(Rand * Range));
}
function $getTreeData() {
    var num=0
    return function (pId) {
        if(pId==0){
            num=0
        }
        num++
        //                随机生成1到3条JSON
        var josnT=[];
        var jsonLime=GetRandomNumFn(1,3);
        for(var i=0;i<=jsonLime;i++){
            // 随机生成4到8位的汉字
            var GetRandomNum=GetRandomNumFn(4,8)
            var a=new Array();
            for(var g=0;g<GetRandomNum;g++){
                a[g]=Math.round(Math.random()*20927) + 19968;
            }
            var b=new Array();
            for(var j in a){
                b.push(String.fromCharCode(a[j]));
            }
            var s=b.join("");
            //   汉字生成完毕
            var createJson={
                projectName:s,
                parentId:pId,
                projectId:$GenNonDuplicateID(),
                hasChild:num<5?GetRandomNumFn(0,1):0,
            }
            josnT.push(createJson)

        }
        return josnT
    }

}
var $getTreeList=$getTreeData()

/* 生成一个用不重复的ID   */
function $GenNonDuplicateID(){
    var randomLength=8
    return Number(Math.random().toString().substr(3,randomLength) + Date.now()).toString(36)
}

/*tree元素*/

/*Tree列表*/
class TreeElement extends React.Component {
    constructor(props) {
        super(props)
        this.state={
            modelList:props.model,
        }
    }
    componentWillReceiveProps(nextProps){
        this.setState({
            modelList:nextProps.model,
        })
    }
    handleFahrenheitChange(temperature) {
    }
    render(){
        if(this.state.modelList.length){
            const listItems = this.state.modelList.map((number) =>
                <ul className="slide-tree" key={number.projectId}>
                    <TreeItemElement model={number} />
                </ul>
            );
            return (
                listItems
            );
        }else{
            return null
        }

    }


}
/*TreeItem*/
class TreeItemElement extends React.Component{
    constructor(props){
        super(props);
        this.state={
            modelItem:props.model,
            modelChild:[],
            special:false,
            isFolder:props.model.hasChild==1,   //控制图标显示，是否有儿子图标
            open:props.model.special=='all'?true:false,  //是否展开
            checkBoxStatus:0,
            toSonCheckBoxStatus:0, //向下传复选框
            sendCheckStatus:props.sendCheckStatus
        }
        this.branchToggle = this.branchToggle.bind(this,false);
        this.getSonData=this.getSonData.bind(this)
        this.checkBoxStatusFn=this.checkBoxStatusFn.bind(this)
    }
    componentWillReceiveProps(nextProps){
        console.log(nextProps)
        this.setState({
            // open:nextProps.open,
            // isFolder:nextProps.model.hasChild==1
        })
    }
    handleFahrenheitChange(temperature) {
    }
    checkBoxStatusFn(){
        this.setState(nexState => ({
            checkBoxStatus:this.state.checkBoxStatus==2?0:2,
            toSonCheckBoxStatus:nexState.checkBoxStatus
        }));
    }
    branchToggle(reload){
        console.log(reload)
        if(this.state.special=='all') return
        if(!this.state.isFolder) return
        if(reload||this.state.modelChild.length==0) {//如果儿子没加载出来
            this.getSonData()
        }
        if (this.state.isFolder) {
            this.setState({
                open: reload||(!this.state.open)
            })
        }
    }
    getSonData(){
        this.setState({
            modelChild: $getTreeList()
        })
    }
    render(){
     return (
         <li className="slideModel" >
             <div className="slideItem">
                 <div className="slideName ellipsis">
                    <span className="slide-tree-editBox">
                        <a onClick={this.checkBoxStatusFn}>{this.state.checkBoxStatus}</a>
                        {/*<a className="slide-tree-checkbox checkBoxBg checkBoxBg_1"></a>*/}
                    </span>
                     <i onClick={this.branchToggle} className={this.state.special=='all'?'icon-all': !this.state.isFolder?'icon-file': this.state.isFolder&&this.state.open?'icon-open': this.state.isFolder&&!this.state.open?'icon-folder':''}></i>
                     <span className="treeModelName">{this.state.modelItem.projectName}{this.state.toSonCheckBoxStatus}</span>
                 </div>
             </div>
                 { this.state.isFolder? <div  style={{display :this.state.open?'block':'none'}}><TreeElement model={this.state.modelChild} sendCheckStatus={this.state.toSonCheckBoxStatus} /> </div>:null  }
             {/*{ this.state.isFolder&&this.state.open? <TreeElement model={this.state.modelChild}  />:null  }*/}

         </li>
     )
    }
}
class Tree extends Component {
    constructor(props){
        super(props);
        this.state={
            model:[]
        }
    }
    componentDidMount(nextProps){
        this.setState({
            model:$getTreeList()
        })
    }
    componentWillUnmount(){

    }
    render() {
        return (
        <div className="slide-tree-edit"> <TreeElement model={this.state.model} /></div>

        );
    }
}

export default Tree;
