echo "Usage: sh jsx-compile.sh <outputDir> [<watchDir>]"
echo

echo "NOTE: If you have not yet initialized the jsx compile environment, please run the following commands first:"
echo "npm init -y"
echo "npm install babel-cli@6 babel-preset-react-app@3"
echo "See: https://reactjs.org/docs/add-react-to-a-website.html"

outputDir="."
watchDir="."

if [ -n "$1" ]
then
	outputDir="$1"
fi

if [ -n "$2" ]
then
	watchDir="$2"
fi


echo
echo "Output directory: $outputDir"
echo "Watch directory: $watchDir"

# For the anatomy of the line below, see:
# https://reactjs.org/docs/add-react-to-a-website.html
# https://babeljs.io/docs/en/babel-node

echo "Press ^D to exit"
echo

npx babel --watch "$watchDir" --out-dir "$outputDir" --extensions ".jsx" --presets es2017 --presets react-app/prod

