import subprocess
import os
import shutil

# git commands
# git rev-parse --long/short HEAD
# git diff-tree --no-commit-id --name-only -r commitid

# Get the latest head from git
commitid = subprocess.run(['git', 'rev-parse', '--short', 'HEAD'], stdout=subprocess.PIPE)

print ("Latest commit id is %s " % commitid.stdout.decode('utf-8'))

# Extract the commit id from multiple lines
commit_id = commitid.stdout.decode('utf-8').splitlines()

print (commit_id[0])

com_id = commit_id[0]

# get the delta files from the git
result = subprocess.run(['git', 'diff-tree', '--no-commit-id', '--name-only', '-r', com_id], stdout=subprocess.PIPE)

print ("File names are %s " % result.stdout.decode('utf-8'))


# Extract the line sperated files.
fileStr = result.stdout.decode('utf-8').splitlines()

# Deployment file = Deployment_Files
dname = 'Deployment_Files'
dnamex = 'Deployment_Files\\'

mataext = '-meta.xml'

# Delete the directory, if already exists. - Or copy the files for back up tracking.
# TODO: error handling.
if os.path.exists(dname):
    print("Deployment directory is deleted, instead it can be archived for further investigations.")
    shutil.rmtree(dname)

# Create the directory. This can be merged in above, But for context clinical. :-)
if not os.path.exists(dname):
    print("Deployment Directory created")
    os.makedirs(dname)

# Loop through the files in the Delta and copy those files with the path in the new deployment folder
for s in fileStr:
    print("Processing file: %s " % s)
    newdest =  "%s/%s" % (dname, s)
    path = os.path.dirname(newdest)
    if not os.path.exists(path):
        os.makedirs(path)
    print("Copied the file to deployment directory, Destiny: %s" % newdest)
    shutil.copyfile(s, newdest)
    # Extract the File name (e.g. '.cls' replace it with '-meta.xml')
    # Remove the slash at last.
    sourcemeta = s.rstrip('/')
    metafile =  "%s%s" %  (sourcemeta, mataext)
    newmetadest =  "%s/%s" % (dname, metafile)
    if os.path.isfile(metafile):
        print("Meta file source detected : %s" % metafile)
        print("Copying the meta file here: %s" % newmetadest)        
        shutil.copyfile(s, newmetadest)
    
    

