function validateEnvironment(env) {
    const { readFileSync } = require('fs');
    const path = require('path');
    const dotenv = require('dotenv');
    const chalk = require('chalk');

    let parsedEnv;
    const envPath = path.join(__dirname, '.env');
    try {
        parsedEnv = dotenv.parse(readFileSync(envPath));
        console.log(
            chalk.green(
                `Using environment variables from ${chalk.greenBright('.env')}`
            )
        );
        if (env.DEBUG || env.NODE_DEBUG) {
            console.log(
                '\n  ' +
                    require('util')
                        .inspect(parsedEnv, {
                            colors: true,
                            compact: false
                        })
                        .replace(/\s*[\{\}]\s*/gm, '')
                        .replace(/,\n\s+/gm, '\n  ') +
                    '\n'
            );
        }
    } catch (e) {
        if (e.code === 'ENOENT') {
            console.log(
                chalk.redBright(
                    `\nNo .env file in ${__dirname}\n\tYou may need to copy '.env.dist' to '.env' to begin, or create your own '.env' file manually.`
                )
            );
        } else {
            console.log(
                chalk.redBright(`\nCould not retrieve and parse ${envPath}.`, e)
            );
        }
    }

    const envalid = require('envalid');
    const { str, bool, url } = envalid;

    return envalid.cleanEnv(env, {
        MAGENTO_BACKEND_URL: url({
            desc: 'Public base URL of of Magento 2.3 instance.',
            example: 'https://magento2.vagrant65'
        }),
        SERVICE_WORKER_FILE_NAME: str({
            desc:
                'Filename to use when autogenerating a service worker to be served at root.',
            example: 'sw.js',
            default: 'sw.js'
        }),
        MAGENTO_BUILDPACK_PROVIDE_SECURE_HOST: bool({
            desc:
                'On first run, create a secure, unique hostname and generate a trusted SSL certificate.',
            default: true
        }),
        MAGENTO_BUILDPACK_SECURE_HOST_AND_UNIQUE_HASH: bool({
            desc:
                'Add a unique hash based on filesystem location to the unique hostname. No effect if MAGENTO_BUILDPACK_PROVIDE_SECURE_HOST is false.',
            default: true
        }),
        ENABLE_SERVICE_WORKER_DEBUGGING: bool({
            desc:
                'Use a service worker in developer mode (PWADevServer), which are disabled in dev mode normally to simplify cache. Good for debugging.',
            default: false
        }),
        UPWARD_JS_UPWARD_PATH: str({
            desc:
                'UPWARD configuration file to use for the PWADevServer and the "stage:venia" sample server.',
            default: 'venia-upward.yml'
        }),
        UPWARD_JS_BIND_LOCAL: bool({
            desc:
                'Upon launching the staging server, automatically attach to a local port and listen.',
            default: true
        }),
        UPWARD_JS_LOG_URL: bool({
            desc:
                'Tell the upward-js prod server to log the bound URL to stdout. Useful in testing and discovery scenarios, but may be disabled in production.',
            default: true
        })
    });
}

module.exports = validateEnvironment;

if (module === require.main) {
    validateEnvironment(process.env);
}
