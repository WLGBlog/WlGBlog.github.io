// $('#dataType').val()
var dataType = '';

$('#convertToDNABtn').click(function(){
    $('#convertToDNA').show();
    $('#convertFromDNA').hide();
});
$('#convertFromDNABtn').click(function(){
    $('#convertFromDNA').show();
    $('#convertToDNA').hide();    
});

document.getElementById('DNAInput').addEventListener('input',function(){
    convertToString($('#DNAInput').val());
});

/* function copyDNA(){
    var copyText = document.getElementById("output");
    copyText.select();
    document.execCommand("Copy");
} */
var clipboard = new Clipboard('.copy-button');


function convertToString(string){
    if(string!=''){  
        var groups = string.match(/.{1,4}/g);

        var strStartIndex;
        var strEndIndex;

        for(var i=0; i<groups.length; i++){
            var main_string = '';

            if(groups[i]=='TGGA' && strStartIndex==null){
                strStartIndex=i;
            } else if(groups[i]=='TCAA' && strEndIndex==null){
                strEndIndex=i;
                main_string += convertToText(strStartIndex,strEndIndex,groups);
                strStartIndex=null;
                strEndIndex=null;
            } else{
                main_string+= convertToNum(groups[i]);
            }
        }
    }
    $('#textOutput').text(main_string);
}
function convertToNum(group){
    var current_num='';
    for(var i=0; i<group.length; i++){
        if(group[i]=='A'){
            current_num+='0';
        } else if(group[i]=='T'){
            current_num+='1';
        } else if(group[i]=='C'){
            current_num+='2';
        } else if(group[i]=='G'){
            current_num+='3';
        }
    }
    return convertFromBaseToBase(current_num,4,10);
}
function convertToText(startIndex,endIndex,groups){
    currentGroups = [];
    asciiCodes = [];

    for(var i=startIndex+1; i<endIndex; i++){
        currentGroups.push(groups[i]);
    }
    for(var i=0; i<currentGroups.length;i++){
        var current_num='';
        for(var c=0; c<currentGroups[i].length;c++){
            if(currentGroups[i][c]=='A'){
                current_num+='0';
            } else if(currentGroups[i][c]=='T'){
                current_num+='1';
            } else if(currentGroups[i][c]=='C'){
                current_num+='2';
            } else if(currentGroups[i][c]=='G'){
                current_num+='3';
            }
        }
        //fromCharCode(ascii_code);
        currentGroups[i]=current_num;
        currentGroups[i]=convertFromBaseToBase(currentGroups[i],4,10);
        currentGroups[i]=String.fromCharCode(parseInt(currentGroups[i]));
    }
    return currentGroups.join('');
}

function insertField() {
    $('#inputArea').html("");
    if($('#dataType').val() == 'text'){
        dataType='text';
        $('#inputArea').html("<input class='form-control' id='dataInput' oninput='convertToDNA()' type='text' placeholder='Enter Text..'>");
    } else if($('#dataType').val() == 'image'){
        dataType='image';
        $('#inputArea').html("<input class='form-control' id='dataInput' onchange='convertToDNA()' type='file'>");
    }
}
function convertToAscii(string){
    var ascii = [];
    string = '|'+string+'`';
    for(var i=0; i<string.length; i++){
        ascii.push(string.charCodeAt(i));
    }
    return ascii;
}
function convertFromBaseToBase(str, fromBase, toBase){
	var num = parseInt(str, fromBase);
    return num.toString(toBase);
}
function convertToDNACode(array){
    // 0=A 1=T 2=C 3=G
    temp_string = '';
    for(var i=0;i<array.length; i++){
        for(var l=0; l<array[i].length; l++){
            if(array[i][l]==0){
                temp_string+='A';
            } else if(array[i][l]==1){
                temp_string+='T';
            } else if(array[i][l]==2){
                temp_string+='C';
            } else if(array[i][l]==3){
                temp_string+='G';
            }
        }
    }
    return temp_string;
}
function receivedText() {
    document.getElementById('output').innerHTML = String(fr.result);
}   

function convertToDNA(){    
    var bFourNums = [];    

    if(dataType=='text'){
        input = $('#dataInput').val();
        var ascii = convertToAscii(input);
    
        for(var i=0; i<ascii.length; i++){
            bFourNums.push(convertFromBaseToBase(ascii[i],10,4));
        }    
        
    } else if(dataType=='image'){
        var dataObj = document.getElementById('dataInput');
        input = dataObj.files[0];
        fr = new FileReader();
        fr.onload = receivedText;
        fr.readAsDataURL(input); 

        input = document.getElementById('output').innerHTML;        
        console.log(input);

        var ascii = convertToAscii(input);
        
        for(var i=0; i<ascii.length; i++){
            bFourNums.push(convertFromBaseToBase(ascii[i],10,4));
        }    
            
    }

    for(var i=0; i<bFourNums.length; i++){
        if(bFourNums[i].length<4){
            var zerosAdded = 4-bFourNums[i].length;
            for(var z=0; z<zerosAdded; z++){
                bFourNums[i] = '0'+bFourNums[i];
            }
        } else if(bFourNums[i].length>4){
            //.match(/.{1,3}/g)
            temp_bFourNums=[];
            temp_bFourNums=bFourNums[i].match(/.{1,4}/g);
            bFourNums.splice(i,1);
            for(var x=0;x<temp_bFourNums.length;x++){
                bFourNums.splice(i+x,0,temp_bFourNums[x]);
            }
        }
    }
    
    $('#output').text(convertToDNACode(bFourNums));
}


insertField();

$('#dataType').change(function(){
    insertField();
});


