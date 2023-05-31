import pymongo
import json
import time
import datetime
import sys

url = 'mongodb://localhost:27017/'
#url = 'mongodb://localhost:27014/'

dbase = sys.argv[1]
print("database: " + str(dbase))

client = pymongo.MongoClient(url)
db = client[dbase]
usersCol = db['users']
inputsCol = db['inputs']
count = 0
dataArray = []

for x in usersCol.find():
    print(len(x))
    if(len(x) == 14):
        count = count+1
        userResponse = []
        id = x['ID']
        ed = x['education']
        ex = x['experience']

        if(ed != "" and ex != "" and id != ""):
            userResponse=[id,ed,ex]

    print(userResponse)
    dataArray.append(userResponse)

print(count)
print(dataArray)
rightNow = datetime.datetime.today().strftime('%m-%d-%Y')
file_name = rightNow + dbase + "-users.json"

with open(str(file_name), 'w+') as outfile:
        json.dump(dataArray, outfile)
