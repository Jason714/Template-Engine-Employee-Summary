// Node packages
const inquirer = require("inquirer");
const fs = require("fs");
// Require js files for each employee's required inputs
const Manager = require("./lib/Manager");
const Intern = require("./lib/Intern");
const Engineer = require("./lib/Engineer");


async function init() {
    console.log("Create your Engineering Team!");

    // Variable to hold HTML
    let teamHTML = "";

    // Variable to hold team size
    let teamSize;

    // Start user prompts
    await inquirer.prompt(
        {
            type: "number",
            message: "How many people are on your Engineering team?",
            name: "userInput"
        }
    )
        .then(res => {

            teamSize = res.userInput + 1;
        });

    // If Team Size is 0 or 1, app will end
    if (teamSize === 0 || teamSize === 1) {
        console.log("You must have at least 2 members on your team!");
        return;
    }

    // loop to iterate over teamSize array 
    for (i = 1; i < teamSize; i++) {

        // variables set
        let name;
        let id;
        let title;
        let email;

        // Questions prompted for basic employee
        await inquirer.prompt([
            {
                type: "input",
                message: `Input employee (${i})'s name?`,
                name: "name"
            },
            {
                type: "input",
                message: `Input employee (${i})'s id?`,
                name: "id"
            },
            {
                type: "input",
                message: `Input employee (${i})'s email?`,
                name: "email"
            },
            {
                type: "list",
                message: `What is employee (${i})'s role?`,
                name: "title",
                choices: ["Engineer", "Intern", "Manager"]
            }
        ])
            .then(res => {

                name = res.name;
                id = res.id;
                title = res.title;
                email = res.email;
            });

        // Switch prompts for different roles
        switch (title) {
            case "Manager":

                //  Prompt for managers office number
                await inquirer.prompt([
                    {
                        type: "input",
                        message: "Input manager's office number?",
                        name: "office"
                    }
                ])
                    .then(res => {

                        // Create manager object with manager class populated from user input
                        const manager = new Manager(name, id, email, res.office);

                        // Bring in manager HTML template
                        teamManager = fs.readFileSync("templates/manager.html");

                        // Add manager HTML with user responses to teamHTML
                        teamHTML = teamHTML + "\n" + eval('`' + teamManager + '`');
                    });
                break;

            case "Intern":
                // Prompt for interns school
                await inquirer.prompt([
                    {
                        type: "input",
                        message: "What school does your Intern attend?",
                        name: "school"
                    }
                ])
                    .then(res => {

                        // Create intern object with intern class populated from user input
                        const intern = new Intern(name, id, email, res.school);

                        // Bring in intern HTML template
                        teamMember = fs.readFileSync("templates/intern.html");

                        // Add intern HTML with user responses to teamHTML
                        teamHTML = teamHTML + "\n" + eval('`' + teamMember + '`');
                    });
                break;

            case "Engineer":
                // Prompt for engineers GitHub
                await inquirer.prompt([
                    {
                        type: "input",
                        message: "What is your Engineer's GitHub?",
                        name: "github"
                    }
                ])
                    .then(res => {

                        // Create engineer object with engineer class populated from user input
                        const engineer = new Engineer(name, id, email, res.github);

                        // Bring in engineer HTML template
                        teamEngineer = fs.readFileSync("templates/engineer.html");

                        // Add engineer HTML with user responses to teamHTML
                        teamHTML = teamHTML + "\n" + eval('`' + teamEngineer + '`');
                    });
                break;
        }
    }

    const mainHTML = fs.readFileSync("templates/main.html");

    teamHTML = eval('`' + mainHTML + '`');

    // write file to new team.html file
    fs.writeFile("output/team.html", teamHTML, function (err) {

        if (err) {
            return console.log(err);
        }

        console.log("Your team has been created!");
    });
}

init();