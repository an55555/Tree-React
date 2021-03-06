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
            toSonCheckBoxStatus:props.sendCheckStatus?props.sendCheckStatus:0
        }
        this.commitCheckState=this.commitCheckState.bind(this)

    }
    componentWillReceiveProps(nextProps){

        this.setState(nexState => ({
            modelList:nextProps.model,
            toSonCheckBoxStatus:nextProps.sendCheckStatus
        }));
    }
    commitCheckState(){return}
    componentWillUnmount(){

    }
    handleFahrenheitChange(temperature) {
    }
    render(){
        if(this.state.modelList.length){
            const listItems = this.state.modelList.map((number,index) =>
                <ul className="slide-tree" key={number.projectId}>{this.state.toSonCheckBoxStatus}
                    <TreeItemElement model={number} index={index}  commitCheckState = {this.commitCheckState.bind(this)}/>
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
            modelIndex:props.index,
            modelChild:[],
            special:false,
            isFolder:props.model.hasChild==1,   //控制图标显示，是否有儿子图标
            open:props.model.special=='all'?true:false,  //是否展开
            checkBoxStatus:props.model.checkState,
            toSonCheckBoxStatus:0, //向下传复选框
            sendCheckStatus:props.sendCheckStatus
        }
        this.branchToggle = this.branchToggle.bind(this,false);
        this.getSonData=this.getSonData.bind(this)
        this.checkBoxStatusFn=this.checkBoxStatusFn.bind(this)
        this.commitCheckState=this.commitCheckState.bind(this)
    }
    componentWillReceiveProps(nextProps){
        this.setState({
            modelItem:nextProps.model,
            checkBoxStatus:nextProps.model.checkState,
        })
        this.sentCheckBoxStatusFn(nextProps.model.checkState)
    }
    handleFahrenheitChange(temperature) {

    }
    /*改变儿子CheckBox*/
    sentCheckBoxStatusFn(state){
        var modelChild=JSON.parse(JSON.stringify(this.state.modelChild))
        for(var i in modelChild){
            modelChild[i]['checkState']=state
        }
        this.setState(nexState => ({
            modelChild:modelChild
        }));
    }
    /*点击改变当前CheckBox*/
    checkBoxStatusFn(){
        var changeStatus=this.state.checkBoxStatus==2?0:2
        this.setState(nexState => ({
            checkBoxStatus:changeStatus,
        }));
        this.sentCheckBoxStatusFn(changeStatus)
        /*向上传播*/
        this.props.commitCheckState(changeStatus,this.state.modelIndex)
    }
    commitCheckState(state,index){
        console.log("儿子的应化"+state+"索引"+index)
        var modelChild=JSON.parse(JSON.stringify(this.state.modelChild))
        modelChild[index]['checkState']=state
        var nowBoll=0
        var nowState=0;
        for(var a in modelChild){
            nowBoll+=modelChild[a]['checkState']
        }
        if(nowBoll==0){
            nowState=0
        }else if(nowBoll==modelChild.length*2){
            nowState=2
        }else{
            nowState=1
        }
        console.log(nowBoll)
        console.log(modelChild.length*2)
        console.log(nowState)
        this.setState(nexState => ({
            modelChild:modelChild,
            checkBoxStatus:nowState
        }));
    }
    /*展开儿子*/
    branchToggle(reload){
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
    /*获取儿子*/
    getSonData(){
        var modelChild=$getTreeList()
        for(var i in modelChild){
            modelChild[i]['checkState']=0
        }
        this.setState({
            modelChild:modelChild
        })
    }
    render(){
        var _this=this
     return (
         <li className="slideModel" >
             <div className="slideItem">
                 <div className="slideName ellipsis">
                    <span className="slide-tree-editBox">
                        <a onClick={this.checkBoxStatusFn} className={"slide-tree-checkbox checkBoxBg checkBoxBg_"+this.state.checkBoxStatus}></a>
                    </span>
                     <i onClick={this.branchToggle} className={this.state.special=='all'?'icon-all': !this.state.isFolder?'icon-file': this.state.isFolder&&this.state.open?'icon-open': this.state.isFolder&&!this.state.open?'icon-folder':''}></i>
                     <span className="treeModelName">{this.state.modelItem.projectName}</span>
                 </div>
             </div>

                 { this.state.isFolder? <div  style={{display :this.state.open?'block':'none'}}>
                         {
                             this.state.modelChild.map(function (number,index){
                                 return (
                                     <ul className="slide-tree" key={number.projectId}>
                                         <TreeItemElement model={number} index={index} commitCheckState = {_this.commitCheckState.bind(this)} />
                                     </ul>
                                 )
                             })
                         }
                     </div>   :null  }
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
        var modelChild=$getTreeList()
        for(var i in modelChild){
            modelChild[i]['checkState']=0
        }
        this.setState({
            model:modelChild
        })
    }


    render() {
        return (
        <div className="">
            <h2>简单的Tree实现，在测试CheckBox选项前，先多展开几个子项</h2>
            <TreeElement model={this.state.model}  />
        </div>
        );
    }
}

export default Tree;
