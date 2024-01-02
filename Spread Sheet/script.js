const spreadSheetContainer = document.querySelector("#spreadsheet-container");
const exportBtn = document.querySelector("#export-btn");
const ROWS = 10;
const COLS = 10;
const spreadsheet = [];
const alphabets = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];


class Cell{
    constructor(isHeader,disabled,data,row,column,rowName,columnName,active=false){
        this.isHeader = isHeader;
        this.disabled = disabled;
        this.data = data;
        this.row = row;
        this.column = column;
        this.rowName = rowName;
        this.columnName = columnName;
        this.active = active;
    }
}
exportBtn.onclick = function(e){ // 버튼클릭이벤트 
    if(confirm("저장 하시겠습니까?")){
        let csv = "";
        for(let i = 0; i < spreadsheet.length; i++) {
            if(i ===0) continue;
            csv +=
                spreadsheet[i]
                    .filter((item) => !item.isHeader)
                    .map((item) => item.data)
                    .join(",") + "\r\n";
        } // 데이터csv 형태로 가공
    
        // csv 파일로 저장 하는 부분
        const csvObj =new Blob([csv]);
        const csvUrl = URL.createObjectURL(csvObj);
        console.log("csv",csvUrl);
    
        const a = document.createElement("a");
        a.href = csvUrl;
        a.download = "New File.csv";
        a.click();
    }
    else{
    }
}

inintSpreadSheet();

// 스프레드 시트 생성
function inintSpreadSheet() {
    for(let i = 0; i < ROWS; i++) {

        let spreadSheetRow = [];

        for(let j = 0; j < COLS; j++) {
            let cellData ='';
            let isHeader = false;
            let disabled = false;

            //모든 row 첫 컬럼에 숫자 넣기
            if(j === 0){
                isHeader = true;
                disabled = true;
                cellData = i;
            }

            if(i === 0){
                isHeader = true;
                disabled = true;
                cellData = alphabets[j-1]; //첫 칸을 띄우기위함
            }

            //첫 row 컬럼은 "";
            //cellData가 undefined이면"";
            if(!cellData){ // undefined null 다 처리 해줌
                cellData = "";
            }

            const rowName= i;
            const columnName = alphabets[j-1];

            const cell =new Cell(isHeader,disabled,cellData,i,j,rowName,columnName,false);
            spreadSheetRow.push(cell);
        }
        spreadsheet.push(spreadSheetRow);
    }
    drawSheet();
    //console.log(spreadsheet);
}

//cell 요소 생성
function createCellEl(cell) {
    const cellEl = document.createElement("input");
    cellEl.className="cell";
    cellEl.id="cell_" + cell.row + cell.column;
    cellEl.value = cell.data;
    cellEl.disabled = cell.disabled;

    if(cell.isHeader) {
        cellEl.classList.add("header");
    }

    cellEl.onclick = () => handleCellClick(cell);
    cellEl.onchange = () => handleOnChange(e.target.value, cell);

    
    return cellEl;
}
function handleOnChange(data, cell) {
    cell.data = data;
}
function handleCellClick(cell) {
    cleartHeaderActiveStates();
    const columnHeader = spreadsheet[0][cell.column];
    const rowHeader = spreadsheet[cell.row][0];
    const columnHeaderEl = getElFromRowCol(columnHeader.row, columnHeader.column);
    const rowHeaderEl = getElFromRowCol(rowHeader.row, rowHeader.column);
    columnHeaderEl.classList.add('active');
    rowHeaderEl.classList.add('active');
    document.querySelector("#cell-status").innertHTML = cell.columnName + "" + cell.rowName;
}
function cleartHeaderActiveStates(){
   // 모든 'active' 클래스가 있는 셀에서 클래스 제거
   const headers = document.querySelectorAll('.header');

   headers.forEach((header) => {
        header.classList.remove('active');
   });
}

function getElFromRowCol(row,col){
    return document.querySelector("#cell_" + row + col);
}

function drawSheet(){
    for(let i = 0; i < spreadsheet.length; i++) {
        const rowContainerEl = document.createElement("div");
        rowContainerEl.className = "cell-row";
        for(let j = 0; j < spreadsheet[i].length; j++) {
            const cell =spreadsheet[i][j];
            rowContainerEl.append(createCellEl(cell));
        }
        spreadSheetContainer.append(rowContainerEl);
    }
}


