
import * as fs from 'fs'
import * as path from 'path'
import * as core from '@actions/core'


async function run(): Promise<void> {
  if (!process.env.GITHUB_EVENT_PATH) {
    core.setFailed('action does not have the $GITHUB_EVENT_PATH env variable')
    return
  }

  const npmrc = path.resolve(process.env.RUNNER_TEMP || process.cwd(), '.npmrc')

  let lines: string[] = []
  if (fs.existsSync(npmrc)) {
    lines.push(fs.readFileSync(npmrc, 'utf8'))
  }

  if (process.env.FONTAWESOME_TOKEN) {
    core.info('* Configure Font Awesome')
    lines.push(`@fortawesome:registry=https://npm.fontawesome.com/`)
    lines.push(`//npm.fontawesome.com/:_authToken=${process.env.FONTAWESOME_TOKEN}`)
  }

  if (process.env.GITHUB_TOKEN) {
    core.info('* Configure GitHub Packages')
    lines.push(`//npm.pkg.github.com/:_authToken=${process.env.GITHUB_TOKEN}`)
    lines.push(`@altipla-consulting:registry=https://npm.pkg.github.com`)
    lines.push(`always-auth=true`)
  }

  lines.push('git-tag-version=false')

  core.info('* Write .npmrc')
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
