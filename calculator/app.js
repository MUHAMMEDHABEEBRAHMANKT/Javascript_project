let screen=document.getElementById("outbox");
let clean=document.querySelector(".clean");
 let del=document.querySelector(".del");
console.clear();
 function btclick(btvalue){
    screen.value +=btvalue;
    
 };
 function eqbtn(){
    if(screen.value===""){
        screen.value="";
    }
    else{
        var text=screen.value;
        var result =eval(text);
        screen.value=result;
    }
 };

 clean.onclick=function(){
    screen.value="";
 };

 del.onclick=function () {
   screen.value=screen.value.slice(0,-1) ;
   text=screen.value;
 };