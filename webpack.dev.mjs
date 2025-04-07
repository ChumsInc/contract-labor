import {merge} from 'webpack-merge';
import common from './webpack.common.mjs';
import * as path from 'node:path';
import * as process from 'node:process';

const localProxy = {
    target: 'http://localhost:8081',
    ignorePath: false,
    changeOrigin: true,
    secure: false,
};

export default merge(common, {
    mode: 'development',
    devServer: {
        allowedHosts: 'auto',
        static: [
            {directory: path.join(process.cwd(), 'public'), watch: false},
            {directory: process.cwd(), watch: false}
        ],
        hot: true,
        proxy: [
            {context: ['/api', '/images', '/intranet', '/pm-images'], ...localProxy}
        ],
        watchFiles: ['src/**/*'],
    },
    devtool: 'eval-source-map',
});
