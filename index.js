#!/usr/bin/env node

import { program } from 'commander';
import inquirer from 'inquirer';
import chalk from 'chalk';
import fs from 'fs-extra';
import path from 'path';
import validateNpmPackageName from 'validate-npm-package-name';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

program
  .name('create-klx-block')
  .description('CLI to create WordPress blocks')
  .argument('[block-name]', 'The block name')
  .action(async (blockName) => {
    try {
      const answers = await promptForMissingOptions(blockName);
      await createBlock(answers);
    } catch (error) {
      console.error(chalk.red('Error:'), error);
      process.exit(1);
    }
  });

program.parse();

async function promptForMissingOptions(blockName) {
  const questions = [];
  
  if (!blockName) {
    questions.push({
      type: 'input',
      name: 'blockName',
      message: 'What is the name of your block?',
      validate: (input) => {
        const validation = validateNpmPackageName(input);
        if (!validation.validForNewPackages) {
          return 'Please enter a valid block name';
        }
        return true;
      },
    });
  }

  questions.push({
    type: 'input',
    name: 'title',
    message: 'What is the display title of your block?',
    default: (answers) => {
      const name = blockName || answers.blockName;
      return name.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    },
  });

  questions.push({
    type: 'input',
    name: 'description',
    message: 'What is the description of your block?',
    default: 'A custom block for Gutenberg.',
  });

  const answers = await inquirer.prompt(questions);
  return {
    blockName: blockName || answers.blockName,
    ...answers,
  };
}

async function createBlock(options) {
  const templateDir = path.join(__dirname, 'templates');
  const blockDir = path.join(process.cwd(), options.blockName);

  console.log(chalk.blue('\nCreating block directory...'));
  await fs.ensureDir(blockDir);

  console.log(chalk.blue('Copying template files...'));
  await fs.copy(templateDir, blockDir);

  // Replace template variables in files
  const files = await fs.readdir(blockDir, { recursive: true });
  for (const file of files) {
    const filePath = path.join(blockDir, file);
    if ((await fs.stat(filePath)).isFile()) {
      let content = await fs.readFile(filePath, 'utf8');
      content = content
        .replace(/{{blockName}}/g, options.blockName)
        .replace(/{{title}}/g, options.title)
        .replace(/{{description}}/g, options.description);
      await fs.writeFile(filePath, content);
    }
  }

  console.log(chalk.green('\nBlock created successfully! 🎉'));
  console.log('\nNext steps:');
  console.log(`1. cd ${options.blockName}`);
  console.log('2. npm install');
  console.log('3. npm start\n');
} 