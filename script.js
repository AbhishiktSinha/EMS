let idGenerator = 1002;
const employeeRecordMap = {};
let update = false;


// get essential DOM elements
const form = document.querySelector("form");
form.addEventListener("submit", saveEmployeeData);

const formButton = form.querySelector("button");

const idDisplay = form.querySelector(".form-id-display");

const recordsContainer = document.querySelector("#records-container");

recordsContainer.addEventListener("click", (event)=>{
    
    if(event.target.className.includes("editRecordButton")) {
        console.log(event.target);
        formButton.innerText = "Update Record";

        update=true;
                
        displayPrefilledForm(event.target.getAttribute("data-empID"));
    }
    if(event.target.className.includes("deleteRecordButton")) {
        deleteObjectAndRow(event.target.getAttribute("data-empID"))
    }
})

function displayEmployeeInTable(employee) {
    // takes an employee object as an input
    // appends that object as a record inside the table.
    // create table row and apend inside records

    let record;

    if(update) {
        // update existing record
        record = recordsContainer.querySelector(`#record-for_${employee.id}`);
        recordCells = record.children;

        let i = 0;
        for(let key in employee) {
            recordCells[i++].innerHTML = employee[key];
        }

        update=false;
    }
    else {
        // creating new record
        record = document.createElement("tr");
        record.id = `record-for_${employee.id}`;
        
        for(let key in employee) {
            
            const cell = document.createElement("td");
            cell.innerText = employee[key];
            record.appendChild(cell);
        }
        
        record.appendChild(createOptionsCell(employee));
        recordsContainer.appendChild(record);
    }
        
}

function createOptionsCell(employee) {
    // create options cell
    const optionsCell = document.createElement("td");
    optionsCell.className= "optionsCell";   
    
    const editIconContainer = document.createElement("button");
    editIconContainer.setAttribute("data-empID", employee.id);
    editIconContainer.className = "editRecordButton";

    const deleteIconContainer = document.createElement("button");    
    deleteIconContainer.className = "deleteRecordButton";
    
    editIconContainer.className += " material-icons icon"; editIconContainer.innerText="edit";
    deleteIconContainer.className += " material-icons icon"; deleteIconContainer.innerText="delete";    
    deleteIconContainer.setAttribute("data-empID", employee.id);
    
    optionsCell.append(editIconContainer, deleteIconContainer);

    return optionsCell;
}

function saveEmployeeData(event) {
    event.preventDefault();

    // if creating new record, create new object
    if(update===false) {
        const employee = {
            id : idGenerator++,
            name : form.empName.value,
            company : form.company.value,
            role : form.empRole.value,
            team : form.team.value,
            salary : form.salary.value
        }
    
        employeeRecordMap[`${employee.id}`] = employee;    
        
        displayEmployeeInTable(employee);
    }
    else {
        // updating existing record
        // get the employee id
        const empId = idDisplay.innerText;

        // reset and hide the idDisplay
        idDisplay.innerText='';
        idDisplay.classList.add("hide");

        // update the employee object

        const employee = employeeRecordMap[empId];
        employee.name = form.empName.value;
        employee.company = form.company.value;
        employee.role = form.empRole.value;
        employee.team = form.team.value;
        employee.salary = form.salary.value;
        
        formButton.innerText = "Create Record";
        displayEmployeeInTable(employee);
        
    }
        
    form.reset();

}

function displayPrefilledForm(employeeId) {
    const employeeObj = employeeRecordMap[employeeId];
    
    // showId    
    idDisplay.classList.remove("hide");
    idDisplay.innerText = employeeId;

    // showName
    form.empName.value = employeeObj.name;

    // show company
    form.company.value = employeeObj.company;

    // show rolw
    form.empRole.value = employeeObj.role;

    // show team
    form.team.value = employeeObj.team;

    // show salary
    form.salary.value = employeeObj.salary;

}

function deleteObjectAndRow(employeeId) {

    const empRow = recordsContainer.querySelector(`#record-for_${employeeId}`);    

    empRow.remove();
    delete employeeRecordMap[employeeId];
}