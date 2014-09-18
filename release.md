Spark API library, release and publish instructions
=======

## Prepare a release

1. First we bump up the version in Package.json.
2. Then we bump up version in bower.json.
3. Step 3 we add the new version number and description to release history in README.
4. We then merge to master or push changes to master depending on which branch we are working on.
5. After that we execute `make release` task, this will create a new browser client bundle and tags, based on the version and push it to the repo.
6. The final step is to actually publish the Spark module to the npm registry and browser client package managers, we
accomplish this by running the make task `make publish` and providing the necessary credentials.

After this we should have all modules and packages updated, some package managers like jsdelivr might take some time
to pick up the changes.

