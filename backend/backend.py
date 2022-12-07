from flask import Flask, request
from flask_cors import CORS
from sklearn.linear_model import LinearRegression  
from sklearn.preprocessing import MinMaxScaler 
from tensorflow import keras 
import math
import numpy as np 
import pandas as pd  
import tensorflow as tf 
import json 


app = Flask(__name__)   
CORS(app)

models = { 
    "df" : None, 

    "train_x" : None, 
    "realPrice" : None, 
    "trainingDate" : None,  
    
    "test_x" : None,  
    "realPrice" : None, 
    "predictedPrice" : None, 
    "predictedDate" : None,  

    "label_scaler" : None, 

    "coef_value" : None, 
    "coef_name" : None, 
} 

def getScaledData():
    df_scaler = MinMaxScaler(feature_range=(0,1))
    scaled_data = df_scaler.fit_transform(models["df"])
    
    label = models["df"]["close"].values
    label_scaler = MinMaxScaler(feature_range=(0,1))
    scaled_label = label_scaler.fit_transform(label.reshape(-1,1))
    
    return scaled_data, scaled_label, label_scaler

def getPredictionFromLSTM(training_data_len, scaled_data, scaled_label, model):
    # Train data
    train_data = scaled_data[0: training_data_len, :]
    x_train = []
    y_train = []
    for i in range(30, len(train_data)):
        x_train.append(train_data[i-30:i, ])
        y_train.append(train_data[i, ])
    x_train, y_train = np.array(x_train), np.array(y_train)
    x_train = np.reshape(x_train, (x_train.shape[0], x_train.shape[1], x_train.shape[2]))
    
    # Test Data
    test_data = scaled_data[training_data_len-30: , : ]
    x_test = []
    y_test = []
    for i in range(30, len(test_data)):
        x_test.append(test_data[i-30: i, ])
        y_test.append(test_data[i, ])
    x_test, y_test = np.array(x_test), np.array(y_test)
    x_test = np.reshape(x_test, (x_test.shape[0], x_test.shape[1], x_test.shape[2]))
    
    predicted_train = model.predict(x_train)
    train_label = scaled_label[30:x_train.shape[0]+30]
    predicted_test = model.predict(x_test)
    test_label = scaled_label[x_train.shape[0]+30:]
    
    return predicted_train, train_label.reshape(-1), predicted_test, test_label.reshape(-1)


def fit_linear_regression(): 
    linearReg = LinearRegression(fit_intercept=False)
    fittedReg = linearReg.fit(models["train_x"], models["trainingPrice"])
    models["coef_value"] = fittedReg.coef_

    predictions = fittedReg.predict(models["test_x"]) 
    models["predictedPrice"] = models["label_scaler"].inverse_transform(predictions.reshape(-1,1)).reshape(-1)

@app.route('/GetStockData', methods=["GET"])
def predict_result(): 
    trainingPrice = models["label_scaler"].inverse_transform(models["trainingPrice"].reshape(-1,1)).reshape(-1)
    realPrice = models["label_scaler"].inverse_transform(models["realPrice"].reshape(-1,1)).reshape(-1)


    return {
        "trainingPrice": trainingPrice.tolist(),
        "trainingDate": models["trainingDate"].tolist(), 
        "predictedPrice": models["predictedPrice"].tolist(), 
        "predictedDate": models["predictedDate"].tolist(), 
        "realPrice": realPrice.tolist()
    } 

@app.route('/GetCoefficient', methods=["GET"]) 
def send_linear_coeff():
    return {"name" : models["coef_name"].tolist(), "value" : models["coef_value"].tolist()}

@app.route('/Rerun', methods=["POST"]) 
def adjust_coefficient():
    coef_value = np.array(request.json["coefficients"])

    predicted = np.zeros(models["test_x"].shape[0]) 
    for i in range(models["test_x"].shape[0]): 
        predicted[i] = np.dot(models["test_x"][i], coef_value) 
    
    predictedPrice = models["label_scaler"].inverse_transform(predicted.reshape(-1,1)).reshape(-1)

    return {"predictedPrice": predictedPrice.tolist()} 

@app.route('/', methods=["GET"])  
def init():   
    models["df"] = pd.read_pickle('../data/sp500.pkl')   
    model = keras.models.load_model('../lstm/models/best_model.h5') 
    training_data_len = math.ceil(models["df"]["close"].values.shape[0] * 0.8)  

    scaled_data, scaled_label, models["label_scaler"] = getScaledData() 
    predicted_train, train_label, predicted_test, test_label = getPredictionFromLSTM(training_data_len, scaled_data, scaled_label, model)
      
    models["trainingDate"] = models["df"].index[30:training_data_len]  
    models["trainingPrice"] = train_label
    models["train_x"] = predicted_train 

    models["predictedDate"] = models["df"].index[training_data_len:] 
    models["realPrice"] = test_label
    models["test_x"] = predicted_test

    models["coef_name"] = models["df"].columns

    fit_linear_regression() 

    return {"Fit Linear Regression": "Complete"} 

if __name__ == "__main__":  
    app.run(host='127.0.0.1',port=5000) 