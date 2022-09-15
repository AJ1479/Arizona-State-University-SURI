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
for u in inputsCol.find():
    userResponse = {}
    uid = u['UserID']
    userResponse['userID'] = uid

    if(len(u['Response']) == 10):
        count = count+1
        print(uid)
        for i in range(10):
            inp1 = u['Response'][i]["input1"]
            print(u['Response'][i]["input1"])
            
            inp2  = u['Response'][i]["input2"]
            print(u['Response'][i]["input2"])

            inp3  = u['Response'][i]["input3"]
            print(u['Response'][i]["input3"])
            
            inp4 = u['Response'][i]["input4"]
            print(u['Response'][i]["input4"])
            
            inp5 = u['Response'][i]["input5"]
            print(u['Response'][i]["input5"])
            
            inp6 = u['Response'][i]["input6"]
            print(u['Response'][i]["input6"])
            
            inp7 = u['Response'][i]["input7"]
            print(u['Response'][i]["input7"])
            
            inp8 = u['Response'][i]["input8"]
            print(u['Response'][i]["input8"])
            
            #print(u['Response'][i]["input9"])
            #print(u['Response'][i]["input10"])
            userResponse[i] = { "input1" : inp1, "input2": inp2, "input3": inp3,  "input4": inp4,  "input5": inp5, "input6": inp6,  "input7": inp7,  "input8": inp8}
        print("")
        dataArray.append(userResponse)
    else:
        print(uid)
        print(len(u['Response']))

#print(count)
#print(dataArray)
rightNow = datetime.datetime.today().strftime('%m-%d-%Y')
file_name = rightNow + dbase + ".json"

with open(str(file_name), 'w+') as outfile:
        json.dump(dataArray, outfile)
