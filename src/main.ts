
import * as fs from 'fs'
import * as path from 'path'
import * as core from '@actions/core'
import * as os from 'os'


async function run(): Promise<void> {
  const npmrc = path.resolve(process.env.RUNNER_TEMP || process.cwd(), '.npmrc')

  let lines: string[] = []
  if (fs.existsSync(npmrc)) {
    lines.push(fs.readFileSync(npmrc, 'utf8'))
  }

  if (core.getInput('fontawesome-token')) {
    core.info('* Configure Font Awesome')
    lines.push(`@fortawesome:registry=https://npm.fontawesome.com/`)
    lines.push(`//npm.fontawesome.com/:_authToken=${core.getInput('fontawesome-token')}`)
  }

  if (core.getInput('github-token')) {
    core.info('* Configure GitHub Packages')
    lines.push(`//npm.pkg.github.com/:_authToken=${core.getInput('github-token')}`)
    lines.push(`@altipla-consulting:registry=https://npm.pkg.github.com`)
    lines.push(`always-auth=true`)
  }

  lines.push('git-tag-version=false')
  
  core.info('* Write .npmrc')
  fs.writeFileSync(npmrc, lines.join(os.EOL), 'utf-8')
  
  core.exportVariable('NPM_CONFIG_USERCONFIG', npmrc)
}

async function main(): Promise<void> {
  try {
    await run()
  } catch (err) {
    core.setFailed(`Action failed with error: ${err}`)
  }
}

main()
