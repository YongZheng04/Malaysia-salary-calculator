let gross = 0;
let epf_employee = 0;
let socso_employee = 0;
let eis_employee = 0;
let epf_employer = 0;
let socso_employer = 0;
let eis_employer = 0;
let calculated_pcb = 0;
let net_salary = 0;

function calculateAnnualTax(chargeable) {
    if (chargeable <= 5000) return 0;
    let tax = 0;
    if (chargeable <= 20000) {
        tax = (chargeable - 5000) * 0.01;
    } else if (chargeable <= 35000) {
        tax = 150 + (chargeable - 20000) * 0.03;
    } else if (chargeable <= 50000) {
        tax = 600 + (chargeable - 35000) * 0.06;
    } else if (chargeable <= 70000) {
        tax = 1500 + (chargeable - 50000) * 0.11;
    } else if (chargeable <= 100000) {
        tax = 3700 + (chargeable - 70000) * 0.19;
    } else if (chargeable <= 250000) {
        tax = 9400 + (chargeable - 100000) * 0.25;
    } else if (chargeable <= 400000) {
        tax = 46900 + (chargeable - 250000) * 0.25;
    } else if (chargeable <= 600000) {
        tax = 84400 + (chargeable - 400000) * 0.26;
    } else if (chargeable <= 1000000) {
        tax = 136400 + (chargeable - 600000) * 0.28;
    } else if (chargeable <= 2000000) {
        tax = 248400 + (chargeable - 1000000) * 0.3;
    } else {
        tax = 548400 + (chargeable - 2000000) * 0.3;
    }
    return tax;
}

function calculate() {
    let basic = parseFloat(document.getElementById('basic').value) || 0;
    let ot = parseFloat(document.getElementById('ot').value) || 0;
    gross = basic + ot;
    document.getElementById('total').innerText = gross.toLocaleString('en-MY', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

    let age = document.getElementById('age').value;

    // EPF rates
    let epf_employee_rate = age === 'less' ? 0.11 : 0.055;
    let epf_employer_rate = gross <= 5000 ? (age === 'less' ? 0.13 : 0.065) : (age === 'less' ? 0.12 : 0.06);

    // For accurate banding for low wages
    let upper = Math.ceil(gross / 20) * 20;
    epf_employee = gross <= 20000 ? upper * epf_employee_rate : gross * epf_employee_rate;
    epf_employer = gross <= 20000 ? upper * epf_employer_rate : gross * epf_employer_rate;

    // SOCSO and EIS rates
    let wage_cap = Math.min(gross, 6000);
    let socso_employee_rate = age === 'less' ? 0.005 : 0;
    let socso_employer_rate = age === 'less' ? 0.0175 : 0.0125;
    let eis_rate = age === 'less' ? 0.002 : 0;
    socso_employee = wage_cap * socso_employee_rate;
    socso_employer = wage_cap * socso_employer_rate;
    eis_employee = wage_cap * eis_rate;
    eis_employer = wage_cap * eis_rate;

    // PCB (approximate)
    let annual_gross = gross * 12;
    let annual_epf_employee = epf_employee * 12;
    let annual_socso_employee = socso_employee * 12;
    let annual_eis_employee = eis_employee * 12;
    let annual_deductions = annual_epf_employee + annual_socso_employee + annual_eis_employee;
    let annual_taxable = annual_gross - annual_deductions;
    let annual_chargeable = Math.max(0, annual_taxable - 9000);
    let annual_tax = calculateAnnualTax(annual_chargeable);
    calculated_pcb = Math.max(0, annual_tax / 12);

    // Display contributions
    document.getElementById('employee-epf').querySelector('.label').innerText = `EPF (${(epf_employee_rate * 100).toFixed(1)}% RM)`;
    document.getElementById('employee-epf').querySelector('.value').innerText = epf_employee.toLocaleString('en-MY', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

    document.getElementById('employee-socso').querySelector('.label').innerText = `SOCSO (${(socso_employee_rate * 100).toFixed(1)}% RM)`;
    document.getElementById('employee-socso').querySelector('.value').innerText = socso_employee.toLocaleString('en-MY', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

    document.getElementById('employee-eis').querySelector('.label').innerText = `SIP (${(eis_rate * 100).toFixed(1)}% RM)`;
    document.getElementById('employee-eis').querySelector('.value').innerText = eis_employee.toLocaleString('en-MY', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

    document.getElementById('employer-epf').querySelector('.label').innerText = `EPF (${(epf_employer_rate * 100).toFixed(1)}% RM)`;
    document.getElementById('employer-epf').querySelector('.value').innerText = epf_employer.toLocaleString('en-MY', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

    document.getElementById('employer-socso').querySelector('.label').innerText = `SOCSO (${(socso_employer_rate * 100).toFixed(2)}% RM)`;
    document.getElementById('employer-socso').querySelector('.value').innerText = socso_employer.toLocaleString('en-MY', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

    document.getElementById('employer-eis').querySelector('.label').innerText = `SIP (${(eis_rate * 100).toFixed(1)}% RM)`;
    document.getElementById('employer-eis').querySelector('.value').innerText = eis_employer.toLocaleString('en-MY', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

    // Set PCB input to calculated value
    document.getElementById('pcb-input').value = calculated_pcb.toFixed(2);

    computeNet();
}

function computeNet() {
    let pcb = parseFloat(document.getElementById('pcb-input').value) || 0;
    let total_employee_deductions = epf_employee + socso_employee + eis_employee + pcb;
    net_salary = gross - total_employee_deductions;
    document.getElementById('net-pay').innerText = net_salary.toLocaleString('en-MY', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}
