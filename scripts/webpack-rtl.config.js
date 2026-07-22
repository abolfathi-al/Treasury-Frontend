const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const RtlCssPlugin = require('rtlcss-webpack-plugin');

module.exports = (env, argv) => {
  const isProduction = argv.mode === 'production';
  
  return {
    mode: argv.mode || 'development',
    entry: {
      styles: './src/assets/sass/main.scss'
    },
    output: {
      path: path.resolve(__dirname, '../src/assets/css'),
      filename: '[name].js',
      clean: false
    },
    module: {
      rules: [
        {
          test: /\.scss$/,
          use: [
            MiniCssExtractPlugin.loader,
            {
              loader: 'css-loader',
              options: {
                sourceMap: !isProduction,
                importLoaders: 2
              }
            },
            {
              loader: 'postcss-loader',
              options: {
                sourceMap: !isProduction,
                postcssOptions: {
                  plugins: [
                    require('autoprefixer')({
                      overrideBrowserslist: ['Chrome >= 120', 'Firefox >= 115', 'Safari >= 16', 'Edge >= 120']
                    })
                  ]
                }
              }
            },
            {
              loader: 'sass-loader',
              options: {
                sourceMap: !isProduction,
                sassOptions: {
                  includePaths: [path.resolve(__dirname, '../src/assets/sass')],
                  outputStyle: 'expanded',
                  precision: 6,
                  silenceDeprecations: ['legacy-js-api', 'import', 'color-functions', 'mixed-decls']
                }
              }
            }
          ]
        }
      ]
    },
    plugins: [
      new MiniCssExtractPlugin({
        filename: '[name].css'
      }),
      new RtlCssPlugin({
        filename: '[name].rtl.css',
        options: {
          autoRename: true,
          autoRenameStrict: false,
          greedy: false,
          processUrls: true,
          stringMap: [
            {
              name: 'ltr-rtl',
              priority: 100,
              search: ['ltr', 'LTR'],
              replace: ['rtl', 'RTL'],
              options: {
                scope: 'selector',
                ignoreCase: false
              }
            }
          ]
        }
      })
    ],
    devtool: !isProduction ? 'source-map' : false
  };
};
