from flask import Flask, request 
from  sklearn.linear_model import LinearRegression 
import numpy as np


app = Flask(__name__)   

models = {
    "train_x" : None, 
    "trainingPrice" : None, 
    "trainingDate" : None,  
    
    "test_x" : None,  
    "realPrice" : None, 
    "predictedPrice" : None, 
    "predictedDate" : None,  

    "coef_value" : None, 
    "coef_name" : None, 
} 

def fit_linear_regression(): 
    linearReg = LinearRegression(fit_intercept=False)
    fittedReg = linearReg.fit(models["train_x"], models["trainingPrice"])
    models["coef_value"] = fittedReg.coef_ 
    models["predictedPrice"] = fittedReg.predict(models["test_x"]) 

@app.route('/GetStockData', methods=["GET"])
def predict_result(): 
    return {
        "trainingPrice": models["trainingPrice"],
        "trainingDate": models["trainingDate"], 
        "predictedPrice": models["predictedPrice"], 
        "preictedDate": models["predictedDate"], 
        "realPrice": models["realPrice"]
    } 

@app.route('/GetCoefficient', methods=["GET"]) 
def send_linear_coeff():
    return {"name" : models["coef_name"], "value" : models["coef_value"]}

@app.route('/Rerun', methods=["POST"]) 
def adjust_coefficient(): 
    models["coef_value"] = request.json["coefficient"] 

    predicted = np.zeros(models["test_x"].shape[0]) 
    for i in range(models["test_x"].shape[0]): 
        predicted[i] = np.dot(models["test_x"][i], models["coef_value"]) 
    models["predictedPrice"] = predicted

    return {"coefficient": models["coef_value"], "predictedPrice": models["predictedPrice"]} 

@app.route('/')  
def init():  
    models["train_x"] = np.random.rand(10, 23) 
    models["trainingPrice"] = np.arange(10, 20)
    models["trainingDate"] = None  

    models["test_x"] = np.random.rand(3, 23) 
    models["realPrice"] = np.arange(20, 30)
    models["predictedDate"] = None 
    models["predictedPrice"] = None  

    models["coef_name"] = None

    fit_linear_regression() 

    return {"Fit Linear Regression": "Complete"} 

if __name__ == "__main__":  
    app.run(host='127.0.0.1',port=5000) 