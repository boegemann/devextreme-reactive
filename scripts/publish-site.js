const { join } = require('path');
const { execSync } = require('child_process');
const { copySync, removeSync } = require('fs-extra');
const ensureRepoUpToDate = require('./ensure-repo-up-to-date');

const COLORS = {
  reset: "\x1b[0m",
  bright: "\x1b[1m",
};
const SITE_DIRECTORY = join(process.cwd(), 'site');
const GENERATED_SITE_DIRECTORY = join(process.cwd(), 'site/_site');
const REPO = 'devexpress/devextreme-reactive';
const BRANCH = 'gh-pages';
const COMMIT_MESSAGE = 'chore: update site';

ensureRepoUpToDate();

const gitTag = execSync('git tag --points-at HEAD', { stdio: 'pipe' }).toString().trim();
const gitRevision = execSync('git rev-parse HEAD', { stdio: 'pipe' }).toString().trim();
const demosRevision = gitTag || gitRevision;

console.log();
console.log('====================');
console.log(`| Publishing site to '${COLORS.bright}${REPO}@${BRANCH}${COLORS.reset}'`);
console.log(`| Demos will be linked to the '${COLORS.bright}${demosRevision}${COLORS.reset}' revision`);
console.log('| Assume that repo is clean and up to date')
console.log('====================');
console.log();

console.log('Building site content...');
execSync(`npm run build:site -- -- --versionTag "${demosRevision}"`, { stdio: 'ignore' });

console.log('Cleaning generated site...');
removeSync(GENERATED_SITE_DIRECTORY);

console.log('Generating site...');
execSync(`bundle exec jekyll build --source ${SITE_DIRECTORY} --destination ${GENERATED_SITE_DIRECTORY}`, { cwd: SITE_DIRECTORY, stdio: 'ignore' });

console.log('Copying github stuff...');
copySync(join(__dirname, 'gh-pages-files'), GENERATED_SITE_DIRECTORY);

console.log('Publishing...');
execSync(`git add -f ${GENERATED_SITE_DIRECTORY}`);
execSync(`git commit -m "${COMMIT_MESSAGE}"`);
execSync(`git subtree push --prefix ${GENERATED_SITE_DIRECTORY} upstream ${BRANCH}`);
execSync('git reset HEAD^');

console.log();
console.log('--------------------');
console.log('Done!');
console.log();
console.log(`You have to check that everything is good at https://devexpress.github.io/devextreme-reactive/`);
console.log('--------------------');
console.log();
