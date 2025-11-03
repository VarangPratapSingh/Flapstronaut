//Simulate Astronaut Movement
let Astronaut = document.getElementById('Astronaut');
let SpacePanel = document.getElementById('GameDisplay');
let pos = parseInt(getComputedStyle(Astronaut).bottom);

//Variables For Initialising Gravity,Velocity And Jump (ie Increase In Velocity Due To Jump)
let velocity=10;
let gravity=0.3;
let jump=10;

let currentscore=0; //Initial Score
let highscore=parseInt(localStorage.getItem('highscore'))||0; //Highest Score
let bgm=0; //Initial Background Position ie 0px
let debris = []; //Array For A Row Of Debris
let DebrisSpeed = Math.min(8,Math.max(4,document.documentElement.clientWidth/800*2)); //Ensures That Debris Is Moving At Proper Speed For All Displays
//Ids To Stop Recursion Of The Functions (All Mentioned Below)
let debrisID,movebgID,mainID,movedebrisID,collisionID;

//Clicking The Start Calls StartGame Function
document.getElementById('Start').addEventListener('click',(e)=>{
    e.stopPropagation();
    setTimeout(()=>{
        startgame();
        Astronaut.style.opacity=1;
        document.getElementById('HighScore').style.opacity=1;
        document.getElementById('Rules').remove();
    },200);
    document.getElementById('Start').remove();
});

//Restart Game After Game Over By Reloading Page
document.getElementById('Restart').addEventListener('click',(e)=>{
    location.reload();
});

//Game Starting Function (Calling The Variables And Necessary Functions)
function startgame(){
    debrisID=setInterval(createdebris,(2200)); //Ammount Of Time In Which Next Row Will Be Made
    movedebris();
    main();
    movebg();
    scorecalc();
    collision();
    document.getElementById('HighScore').textContent=`High Score: ${highscore}`;
}

//Game Stopping Function (Cancelling The Animation Properties)
function gamestop(){
    //Stop Animations And Counters Like Score And Obstacle Generator
    cancelAnimationFrame(mainID);
    cancelAnimationFrame(movebgID);
    cancelAnimationFrame(movedebrisID);
    cancelAnimationFrame(collisionID);
    clearInterval(scoreinter);
    clearInterval(debrisID);
    //Update Score And Highscore
    highscore=Math.max(highscore,currentscore);
    localStorage.setItem('highscore',highscore);
    document.getElementById('HighScore').textContent=`High Score: ${highscore}`;
    document.getElementById('Score').textContent=`Current Score: ${currentscore}`;
    //Removes Astronaut And Debris From Space
    Astronaut.remove();
    debris.forEach(deb=>deb.remove());
    debris=[];
    //Show Restart Button
    document.getElementById('Restart').style.opacity=1;
    document.getElementById('Restart').style.pointerEvents='auto';
}

//Gravity (Constantly Pulling The Astronaut Down Towards The Earth)
function main(){
    velocity-=gravity;
    pos+=velocity;
    //Animating Ending The Game After Touching Bottom Or Top Also Calling EndGame
    if (pos<39){pos=39;Astronaut.style.transform = 'rotate(90deg)';gamestop();}
    if (pos>document.documentElement.clientHeight-20){pos=document.documentElement.clientHeight-20;Astronaut.style.transform = 'rotate(-30deg)';gamestop();}
    Astronaut.style.bottom=pos+'px';
    //Animating Astronaut Jumping And Falling
    if (velocity<-10){Astronaut.style.transform = 'rotate(180deg)';}
    else if (velocity<0){Astronaut.style.transform = 'rotate(50deg)';}
    else {Astronaut.style.transform = 'rotate(0deg)';}
    mainID=requestAnimationFrame(main);
}

//Astronaut Jump (Suddenly Increasing The Velocity Making It Positive)
SpacePanel.addEventListener('click',()=>{
    //Jumping To Increase Velocity
    velocity=jump;
});

//Space Movement (Movement Of Background Based On Reducing X Axis Ensuring Image Is Repeating)
function movebg(){
    bgm-=1.8; //Framepace Of Background Movement
    document.getElementById('GameDisplay').style.backgroundPositionX = bgm + 'px';
    movebgID=requestAnimationFrame(movebg);
}

//Creating Obstacles
function createdebris(){
    //Random Number Of Debris Per Row
    let numberofdebris=Math.floor(Math.random()*2)+1;
    for (let i=0;i<numberofdebris;i++){
        //For Each Debris Add ClassList Of Rocks ie Debris
        let debry=document.createElement('div');
        debry.classList.add('Rocks');
        //Ensures That No 2 Debris Are Sticking With Each Other
        let randomstart;
        if (debris.length>0){
            randomstart = parseInt(debris[i-1].style.bottom) + Math.floor (Math.random()*120)+80;
            if (randomstart>540){randomstart=60;}
        }
        else{randomstart = Math.floor (Math.random()*(600-60))+60;}
        debry.style.bottom = randomstart + 'px';
        debry.style.left = document.documentElement.clientWidth + 'px';
        debry.style.position = 'absolute';
        SpacePanel.appendChild(debry);
        debris.push(debry);
    }
}

//Moving Obstacles
function movedebris(){
    for (let i=debris.length-1;i>=0;i--){
        let deb=debris[i];
        let leftpos=parseInt(deb.style.left);
        //Debris Moving According To Display Size Set ABove
        leftpos-=DebrisSpeed;
        deb.style.left=leftpos+'px';
        //Debris Removal After Reaching 0px
        if (leftpos<=-40){
            deb.remove();
            debris.splice(i,1);
        }
    }
    movedebrisID=requestAnimationFrame(movedebris);
}

//Checking Collision
function collision(){
    let AstronautPosition = Astronaut.getBoundingClientRect();
    for (let deb of debris){
        let DebrisPosition = deb.getBoundingClientRect();
        //Checks If The Astronaut And Debris Collide
        if (AstronautPosition.left<DebrisPosition.left+DebrisPosition.width-5 && AstronautPosition.left+AstronautPosition.width>DebrisPosition.left+5 && AstronautPosition.top<DebrisPosition.top+DebrisPosition.height-5 && AstronautPosition.top+AstronautPosition.height>DebrisPosition.top+5){gamestop();}
    }
    requestAnimationFrame(collision);
}

//Score Calculation
function scorecalc(){
    //Increases Score Per 600ms And Constantly Sets Highscore If CurrentScrore Exceeded The HighScore
    scoreinter=setInterval(()=>{
        currentscore++;
        highscore=Math.max(highscore,currentscore);
        localStorage.setItem('highscore',highscore);
        document.getElementById('HighScore').textContent=`High Score: ${highscore}`;
        document.getElementById('Score').textContent=`Current Score: ${currentscore}`;
    },600);
}