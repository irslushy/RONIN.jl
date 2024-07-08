var documenterSearchIndex = {"docs":
[{"location":"api.html#Basic-Workflow-Walkthrough","page":"Reference","title":"Basic Workflow Walkthrough","text":"","category":"section"},{"location":"api.html","page":"Reference","title":"Reference","text":"RadarQC is a package that utilizes a methodology developed by Dr. Alex DesRosiers and Dr. Michael Bell to remove non-meteorological gates from Doppler radar scans by leveraging machine learning techniques. In its current form, it contains functionality to derive a set of features from input radar data, use these features to train a Random Forest classification model, and apply this model to the raw fields contained within the radar scans. It also has some model evaluation ability. The beginning of this guide will walk through a basic workflow to train a model starting from scratch. ","category":"page"},{"location":"api.html#API-/-Function-References","page":"Reference","title":"API / Function References","text":"","category":"section"},{"location":"api.html#Calculating-Model-Input-Features","page":"Reference","title":"Calculating Model Input Features","text":"","category":"section"},{"location":"api.html","page":"Reference","title":"Reference","text":"calculate_features(::String, ::String, ::String, ::Bool)\ncalculate_features(::String, ::Vector{String}, ::Vector{Matrix{Union{Missing, Float64}}}, ::String, ::Bool)\nsplit_training_testing!\ntrain_model(::String, ::String)\nremove_validation\nget_feature_importance(::String, ::Vector{Float64})","category":"page"},{"location":"api.html#Ronin.calculate_features-Tuple{String, String, String, Bool}","page":"Reference","title":"Ronin.calculate_features","text":"Function to process a set of cfradial files and produce input features for training/evaluating a model \n\nRequired arguments\n\ninput_loc::String\n\nPath to input cfradial or directory of input cfradials \n\nargument_file::String\n\nPath to configuration file containing which features to calculate \n\noutput_file::String\n\nPath to output calculated features to (generally ends in .h5)\n\nHAS_MANUAL_QC::Bool\n\nSpecifies whether or not the file(s) have already undergone a manual QC procedure.  If true, function will also output a Y array used to verify where manual QC removed gates. This array is formed by considering where gates with non-missing data in raw scans (specified by remove_variable) are set to missing after QC is performed. \n\nOptional keyword arguments\n\nverbose::Bool\n\nIf true, will print out timing information as each file is processed \n\nREMOVE_LOW_NCP::Bool\n\nIf true, will ignore gates with Normalized Coherent Power/Signal Quality Index below a threshold specified in RQCFeatures.jl\n\nREMOVE_HIGH_PGG::Bool\n\nIf true, will ignore gates with Probability of Ground Gate (PGG) values at or above a threshold specified in RQCFeatures.jl \n\nQC_variable::String\n\nName of variable in input NetCDF files that has been quality-controlled. \n\nremove_variable::String\n\nName of a raw variable in input NetCDF files. Used to determine where missing data exists in the input sweeps.  Data at these locations will be removed from the outputted features. \n\nreplace_missing \n\nWhether or not to replace MISSING values with FILL_VAL in spatial parameter calculations Default value: False \n\n\n\n\n\n","category":"method"},{"location":"api.html#Ronin.calculate_features-Tuple{String, Vector{String}, Vector{Matrix{Union{Missing, Float64}}}, String, Bool}","page":"Reference","title":"Ronin.calculate_features","text":"Function to process a set of cfradial files and produce input features for training/evaluating a model.      Allows for user-specified tasks and weight matrices, otherwise the same as above.  \n\nRequired arguments\n\ninput_loc::String\n\nPath to input cfradial or directory of input cfradials \n\ntasks::Vector{String}\n\nVector containing the features to be calculated for each cfradial. Example [DBZ, ISO(DBZ)]\n\nweight_matrixes::Vector{Matrix{Union{Missing, Float64}}}\n\nFor each task, a weight matrix specifying how much each gate in a spatial calculation will be given.  Required to be the same size as tasks\n\noutput_file::String \n\nLocation to output the calculated feature data to. \n\nHAS_MANUAL_QC::Bool\n\nSpecifies whether or not the file(s) have already undergone a manual QC procedure.  If true, function will also output a Y array used to verify where manual QC removed gates. This array is formed by considering where gates with non-missing data in raw scans (specified by remove_variable) are set to missing after QC is performed. \n\nOptional keyword arguments\n\nverbose::Bool\n\nIf true, will print out timing information as each file is processed \n\nREMOVE_LOW_NCP::Bool\n\nIf true, will ignore gates with Normalized Coherent Power/Signal Quality Index below a threshold specified in RQCFeatures.jl\n\nREMOVE_HIGH_PGG::Bool\n\nIf true, will ignore gates with Probability of Ground Gate (PGG) values at or above a threshold specified in RQCFeatures.jl \n\nQC_variable::String\n\nName of variable in input NetCDF files that has been quality-controlled. \n\nremove_variable::String\n\nName of a raw variable in input NetCDF files. Used to determine where missing data exists in the input sweeps.  Data at these locations will be removed from the outputted features. \n\nreplace_missing \n\nWhether or not to replace MISSING values with FILL_VAL in spatial parameter calculations Default value: False \n\n\n\n\n\n","category":"method"},{"location":"api.html#Ronin.split_training_testing!","page":"Reference","title":"Ronin.split_training_testing!","text":"Function to split a given directory or set of directories into training and testing files using the configuration described in DesRosiers and Bell 2023. This function assumes that input directories only contain cfradial files  that follow standard naming conventions, and are thus implicitly chronologically ordered. The function operates  by first dividing file names into training and testing sets following an 80/20 training/testing split, and subsequently softlinking each file to the training and testing directories. Attempts to avoid temporal autocorrelation while maximizing  variance by dividing each case into several different training/testing sections. \n\nRequired Arguments:\n\nDIR_PATHS::Vector{String}\n\nList of directories containing cfradials to be used for model training/testing. Useful if input data is split  into several different cases. \n\nTRAINING_PATH::String \n\nDirectory to softlink files designated for training into. \n\nTESTING_PATH::String \n\nDirectory to softlink files designated for testing into. \n\n\n\n\n\n","category":"function"},{"location":"api.html#Ronin.train_model-Tuple{String, String}","page":"Reference","title":"Ronin.train_model","text":"Function to train a random forest model using a precalculated set of input and output features (usually output from  calculate_features). Returns nothing. \n\nRequired arguments\n\ninput_h5::String\n\nLocation of input features/targets. Input features are expected to have the name \"X\", and targets the name \"Y\". This should be  taken care of automatically if they are outputs from calculate_features\n\nmodel_location::String \n\nPath to save the trained model out to. Typically should end in .joblib\n\nOptional keyword arguments\n\nverify::Bool = false \n\nWhether or not to output a separate .h5 file containing the trained models predictions on the training set  (Y_PREDICTED) as well as the targets for the training set (Y_ACTUAL) \n\nverify_out::String=\"model_verification.h5\"\n\nIf verify, the location to output this verification to. \n\ncol_subset=: \n\nSet of columns from input_h5 to train model on. Useful if one wishes to train a model while excluding some features from a training set. \n\n\n\n\n\n","category":"method"},{"location":"api.html#Ronin.remove_validation","page":"Reference","title":"Ronin.remove_validation","text":"Function used to remove a given subset of the rows from a feature set so that they may be used for model validation/tuning.\n\nCurrently configured to utilize the 90/10 split described in DesRosiers and Bell 2023.\n\nRequired arguments\n\ninput_dataset::String\n\nPath to h5 files containing model features \n\nOptional keyword arguments\n\ntraining_output::String = \"train_no_validation_set.h5\"\n\nPath to output training features with validation removed to \n\nvalidation_output::String = \"validation.h5\"\n\nPath to output validation features to\n\nremove_original::Bool = true \n\nWhether or not to remove the original file described by the input_dataset path. \n\n\n\n\n\n","category":"function"},{"location":"api.html#Ronin.get_feature_importance-Tuple{String, Vector{Float64}}","page":"Reference","title":"Ronin.get_feature_importance","text":"Uses L1 regression with a variety of λ penalty values to determine the most useful features for\n\ninput to the random forest model.  \n\n\n\nRequired Input\n\n\n\ninput_file_path::String \n\nPath to .h5 file containing model training features under [\"X\"] parameter, and model targets under [\"Y\"] parameter.   Also expects the h5 file to contain an attribute known as Parameters containing abbreviations for the feature types \n\nλs::Vector{Float64}\n\nVector of values used to vary the strength of the penalty term in the regularization.\n\nOptional Keyword Arguments\n\n\n\npred_threshold::Float64\n\nMinimum cofidence level for binary classifier when predicting\n\nReturns\n\nReturns a DataFrame with each row containing info about a regression for a specific λ, the values of the regression coefficients      for each input feature, and the Root Mean Square Error of the resultant regression. \n\n\n\n\n\n","category":"method"},{"location":"api.html#Applying-and-evaluating-a-trained-model-to-data","page":"Reference","title":"Applying and evaluating a trained model to data","text":"","category":"section"},{"location":"api.html","page":"Reference","title":"Reference","text":"QC_scan\npredict_with_model(::String, ::String)\nevaluate_model(::String, ::String, ::String)","category":"page"},{"location":"api.html#Ronin.QC_scan","page":"Reference","title":"Ronin.QC_scan","text":"Primary function to apply a trained RF model to certain raw fields of a cfradial scan. Values determined to be  non-meteorological by the RF model will be replaced with Missing\n\nRequired Arguments\n\nfile_path::String \n\nLocation of input cfradial or directory of cfradials one wishes to apply QC to \n\nconfig_file_path::String \n\nLocation of config file containing features to calculate as inputs to RF model \n\nmodel_path::String \n\nLocation of trained RF model (in joblib file format) \n\nOptional Arguments\n\nVARIABLES_TO_QC::Vector{String} = [\"ZZ\", \"VV\"]\n\nList containing names of raw variables in the CFRadial to apply QC algorithm to. \n\nQC_suffix::String = \"_QC\"\n\nUsed for naming the QC-ed variables in the modified CFRadial file. Field name will be QCsuffix appended to the raw field.  Example: `DBZQC`\n\nindexer_var::String = \"VV\"\n\nVariable used to determine what gates are considered \"missing\" in the raw moments. QC will not  be applied to these gates, they will simply remain missing. \n\ndecision_threshold::Float64 = .5\n\nUsed to leverage probablistic nature of random forest methodology. When the model has a greater than decision_threshold level confidence that a gate is meteorological data, it will be assigned as such. Anything at or below this confidence threshold will be assigned non-meteorological. At least in the ELDORA case, aggressive thresholds (.8 and above) have been found to maintain \n\n92% of the meteorological data while removing >99% of non-meteorological gates. \n\noutput_mask::Bool = true\n\nWhether or not to output the QC preditions from the model output. A value of 0 means the model predicted the gate to be non-meteorological, 1 corresponds to predicted meteorological data, and -1 denotes data that did not meet minimum thresholds\n\nmask_name::String = \"QC_MASK\"\n\nWhat to name the output QC predictions. \n\n\n\n\n\n","category":"function"},{"location":"api.html#Ronin.predict_with_model-Tuple{String, String}","page":"Reference","title":"Ronin.predict_with_model","text":"Simple function that opens a given h5 file with feature data and applies a specific model to it.  Returns a tuple of predictions, targets. Also contains the ability to write these predictions and solutions  out to a separate h5 file. \n\nRequired arguments\n\nmodel_path::String \n\nLocation of trained RF model (saved in joblib file format) \n\ninput_h5::String \n\nLocation of h5 file containing input features. \n\nOptional Keyword Arguments\n\nwrite_out::Bool = false\n\nWhether or not to write the results out to a file \n\noutfile::String = Path to write results to if write_out == true \n\nResults will be written in the h5 format with the name \"Predicitions\" and \"Ground Truth\" \n\n\n\n\n\n","category":"method"},{"location":"api.html#Ronin.evaluate_model-Tuple{String, String, String}","page":"Reference","title":"Ronin.evaluate_model","text":"Function that takes in a given model, directory containing either cfradials or an already processed h5 file,  a path to the configuration file, and a mode type (\"C\" for cfradials \"H\" for h5) and returns a Julia DataFrame  containing a variety of metrics about the model's performance on the specified set, including precision and recall scores. \n\nRequired arguments\n\nmodel_path::String\n\nPath to input trained random forest model\n\ninput_file_dir::String\n\nPath to input h5 file or directory of cfradial files to be processed\n\nconfig_file_path \n\nPath to configuration file containing information about what features to calculate \n\nOptional Arguments\n\nmode::String = \"C\"\n\nWhether to process a directory of cfradial files (\"C\" mode) or simply utilize an already-processed h5 file (\"H\" mode) \n\nwrite_out::Bool = false\n\nIf in \"C\" mode, whether or not to write the resulting calculated features out to a file \n\noutput_file::String = \"_.h5\" \n\nLocation to write calculated output features to. \n\ncol_subset = : \n\nSubset of columns of X array to input to model. \n\nAlso contains all keyword arguments for calculate_features \n\n\n\n\n\n","category":"method"},{"location":"api.html#Non-user-facing","page":"Reference","title":"Non-user facing","text":"","category":"section"},{"location":"api.html","page":"Reference","title":"Reference","text":"get_task_params\nprocess_single_file","category":"page"},{"location":"api.html#Ronin.get_task_params","page":"Reference","title":"Ronin.get_task_params","text":"Function to parse a given task list Also performs checks to ensure that the specified  tasks are able to be performed to the specified CFRad file\n\n\n\n\n\nParses input parameter file for use in outputting feature names to      HDF5 file as attributes. NOTE: Cfradial-unaware. If one of the variables is      specified incorrectly in the parameter file, will cause errors\n\n\n\n\n\n","category":"function"},{"location":"api.html#Ronin.process_single_file","page":"Reference","title":"Ronin.process_single_file","text":"Driver function that calculates a set of features from a single CFRadial file. Features are  specified in file located at argfile_path. \n\nWill return a tuple of (X, Y, indexer) where X is the features matrix,  Y, a matrix containing the verification \n\nwhere human QC determined the gate was meteorological (value of 1), or non-meteorological (value of 0), \n\nand indexer contains a vector of booleans describing which gates met basic quality control thresholds  and thus are represented in the X and Y matrixes\n\nWeight matrixes are specified in file header, or passed as explicit argument. \n\nRequired arguments\n\ncfrad::NCDataset \n\nInput NCDataset containing radar scan variables \n\nargfile_path::String \n\nPath to file contaning config/task information. \n\nOptional keyword arguments\n\nHAS_MANUAL_QC::Bool = false\n\nIf the scan has already had a human apply quality control to it, set to true. Otherwise, false\n\nREMOVE_LOW_NCP::Bool = false\n\nWhether or not to ignore gates that do not meet a minimum NCP/SQI threshold. If true, these gates will be set to false in indexer, and features/verification will not be calculated for them. \n\nREMOVE_HIGH_PGG::Bool = false\n\nWhether or not to ignore gates that exceed a given Probability of Ground Gate(PGG) threshold. If true, these gates will be set to false in indexer, and features/verification will not be calculated for them. \n\nQC_variable::String = \"VG\"\n\nName of a variable in input CFRadial file that has had QC applied to it already. Used to calculate verification Y matrix. \n\nremove_variable::String = \"VV\" \n\nName of raw variable in input CFRadial file that will be used to determine where missing gates exist in the sweep.\n\nreplace_missing::Bool = false\n\nFor spatial parameters, whether or not to replace missings values with FILL_VAL\n\n\n\nReturns:\n\n-X: Array that is dimensioned (num_gates x num_features) where num_gates is the number of valid \n    (non-missing, meeting NCP/PGG thresholds) the function finds, and num_features is the \n    number of features specified in the argument file to calculate. \n\n-Y: IF HAS_MANUAL_QC == true, will return Y, array containing 1 if a datapoint was retained \n    during manual QC, and 0 otherwise. \n\n-INDEXER: Based on remove_variable as described above, contains boolean array specifiying\n            where in the scan features valid data and where does not.\n\n\n\n\n\n","category":"function"},{"location":"index.html","page":"Home","title":"Home","text":"Ronin (Random forest Optimized Nonmeteorological IdentificatioN) is a package that utilizes a methodology developed by Dr. Alex DesRosiers and Dr. Michael Bell to remove non-meteorological gates from Doppler radar scans by leveraging machine learning techniques. In its current form, it contains functionality to derive a set of features from input radar data, use these features to train a Random Forest classification model, and apply this model to the raw fields contained within the radar scans. It also has some model evaluation ability. The beginning of this guide will walk through a basic workflow to train a model starting from scratch.  ","category":"page"},{"location":"index.html#Workflow-Walkthrough","page":"Home","title":"Workflow Walkthrough","text":"","category":"section"},{"location":"index.html","page":"Home","title":"Home","text":"(Image: Roninflowchart)","category":"page"},{"location":"index.html#Preparing-input-data","page":"Home","title":"Preparing input data","text":"","category":"section"},{"location":"index.html","page":"Home","title":"Home","text":"","category":"page"},{"location":"index.html","page":"Home","title":"Home","text":"The first step in the process is to split our data so that some of it may be utilized for model training and the other portion for model testing. It's important to keep the two sets separate, otherwise the model may overfit. ","category":"page"},{"location":"index.html","page":"Home","title":"Home","text":"The basic requirement here is to have a directory or directories of cfradial scans, and two directories to put training and testing files, respectively. Make sure that no other files are present in these directories. To do this, the split_training_testing! function will be used. For example, if one had two cases of radar data, located in ./CASE1/ and ./CASE2/ and wanted to split into ./TRAINING and ./TESTING, execute the command ","category":"page"},{"location":"index.html","page":"Home","title":"Home","text":"split_training_testing([\"./CASE1\", \"./CASE2\"], \"./TRAINING\", \"./TESTING\")","category":"page"},{"location":"index.html","page":"Home","title":"Home","text":"More information about this function is contained within the docs. ","category":"page"},{"location":"index.html","page":"Home","title":"Home","text":"","category":"page"},{"location":"index.html","page":"Home","title":"Home","text":"Now that we have split the input files, we can proceed to calculate the features used to train and test our Random Forest model. Further details are contained within the aforementioned manuscript, but it has been shown that the parameters contained here are most effective for discriminating between meteorological/non-meteorological gates. For this, we will use the calculate_features function. Since we are calculating features to train a model at this point, we will assume that they have already a human apply QC. To get the most skillful model possible, we will want to remove \"easy\" cases from the training set, so set REMOVE_LOW_NCP=true and REMOVE_HIGH_PGG=true to ignore data not meeting minimum quality thresholds. It's also important to specify which variable contained with the input scans has already been QC'ed - in the ELDORA scans, this is VG. missing values must also be removed from the initial training set, so we'll use a raw variable VV to determine where these gates are located. With that said, one may now invoke ","category":"page"},{"location":"index.html","page":"Home","title":"Home","text":"calculate_features(\"./TRAINING\", \"./config.txt\", \"TRAINING_FEATURES.h5\", true;\n                    verbose=true, REMOVE_LOW_NCP = true, REMOVE_HIGH_PGG=true,\n                    QC_variable=\"VG\", remove_variable=\"VV\")","category":"page"},{"location":"index.html","page":"Home","title":"Home","text":"To use the config file located at ./config.txt to output the training features to TRAINING_FEATURES.h5. ","category":"page"},{"location":"index.html","page":"Home","title":"Home","text":"For clarity's sake, for the testing features this step would be exectued again but changing the input directory and output location. ","category":"page"},{"location":"index.html","page":"Home","title":"Home","text":"This is a somewhat computationally expensive process for large datasets >1000 scans, and so can take over 15 minutes. ","category":"page"},{"location":"index.html","page":"Home","title":"Home","text":"","category":"page"},{"location":"index.html#Training-a-Random-Forest-Model","page":"Home","title":"Training a Random Forest Model","text":"","category":"section"},{"location":"index.html","page":"Home","title":"Home","text":"","category":"page"},{"location":"index.html","page":"Home","title":"Home","text":"Now that the somewhat arduous process of calculating input features has completed, it's time to train our model! We'll use the training set for this, which we have previously defined to be located at ./TRAINING_FEATURES.h5. Invoke as follows","category":"page"},{"location":"index.html","page":"Home","title":"Home","text":"train_model(\"./TRAINING_FEATURES.h5\", \"TRAINED_MODEL.joblib\"; verify=true, verify_out=\"TRAINING_SET_VERIFICATION.h5\")","category":"page"},{"location":"index.html","page":"Home","title":"Home","text":"This will train a model based off the information contained within TRAINING_FEATURES.h5, saving it for further use at ./TRAINED_MODEL.joblib. The verify keyword arguments means that, once trained, the model will be automatically applied to the training dataset and the predictions will be output, along with the ground truth/correct answers, to the h5 file at TRAINING_SET_VERIFICATION.h5.   ","category":"page"},{"location":"index.html","page":"Home","title":"Home","text":"","category":"page"},{"location":"index.html#Applying-the-trained-model-to-a-radar-scan","page":"Home","title":"Applying the trained model to a radar scan","text":"","category":"section"},{"location":"index.html","page":"Home","title":"Home","text":"","category":"page"},{"location":"index.html","page":"Home","title":"Home","text":"It's finally time to begin cleaning radar data! We'll use the QC_scan function to apply our model to raw moments. Let's imagine we want to clean the scan located at ./cfrad_example_scan using the model we previously trained at TRAINED_MODEL.joblib. By default, this will clean the variables with the names ZZ and VV, though this can be changed by modifying the VARIABLES_TO_QC argument. They will be added to the cfradial file with the names ZZ_QC and VV_QC, respectively, though this suffix can be changed though keyword arguments. Execute as  ","category":"page"},{"location":"index.html","page":"Home","title":"Home","text":"QC_scan(\"./cfrad_example_scan\", \"./config.txt\", \"./TRAINED_MODEL.joblib\")","category":"page"},{"location":"index.html","page":"Home","title":"Home","text":"","category":"page"},{"location":"index.html#Spatial-Predictors-Reference","page":"Home","title":"Spatial Predictors Reference","text":"","category":"section"},{"location":"index.html","page":"Home","title":"Home","text":"","category":"page"},{"location":"index.html","page":"Home","title":"Home","text":"A key portion of this methodology is deriving \"predictors\" from raw input radar moments. Raw moments include quantities such as Doppler velocity and reflectivity, while derived variables include things such as the standard deviation of a raw moment across a set of azimuths and ranges in a radar scan. Calculating these features allows the addition of spatial context to the classification problem even when only classifying a single gate. ","category":"page"},{"location":"index.html","page":"Home","title":"Home","text":"Each of the spatial predictors (Currently STD, ISO, and AVG) have predefined \"windows\" that specify the area they calculate. These windows are specified as matrixes at the top of RoninFeatures.jl. They can also be user specified when using calculate_features. &nbsp;","category":"page"},{"location":"index.html#Currently-Implemented-Functions:","page":"Home","title":"Currently Implemented Functions:","text":"","category":"section"},{"location":"index.html#**STD(VAR)**","page":"Home","title":"STD(VAR)","text":"","category":"section"},{"location":"index.html","page":"Home","title":"Home","text":"","category":"page"},{"location":"index.html","page":"Home","title":"Home","text":"Calculates the standard deviation of each gate of the variable with name VAR in the given radar sweep. By default, gates that contain missing values are ignored in this calculation. Further by default ","category":"page"},{"location":"index.html","page":"Home","title":"Home","text":"","category":"page"},{"location":"index.html#**ISO(VAR)**","page":"Home","title":"ISO(VAR)","text":"","category":"section"},{"location":"index.html","page":"Home","title":"Home","text":"","category":"page"},{"location":"index.html","page":"Home","title":"Home","text":"Calculates the \"isolation\" of each gate of the variable with name VAR in the given radar sweep. This calculation sums the number of adjacent gates in both range and aziumth that contain missing values. ","category":"page"},{"location":"index.html","page":"Home","title":"Home","text":"","category":"page"},{"location":"index.html#**AVG(VAR)**","page":"Home","title":"AVG(VAR)","text":"","category":"section"},{"location":"index.html","page":"Home","title":"Home","text":"","category":"page"},{"location":"index.html","page":"Home","title":"Home","text":"Calculates the average of each gate of the variable with name VAR in the given radar sweep. By default, gates that contain missing values are ignored in this calculation. ","category":"page"},{"location":"index.html","page":"Home","title":"Home","text":"","category":"page"},{"location":"index.html#**RNG/NRG**","page":"Home","title":"RNG/NRG","text":"","category":"section"},{"location":"index.html","page":"Home","title":"Home","text":"Calculates the range of all radar gates (RNG) from the airborne platform, or normalized by altitude (NRG).  ___ ","category":"page"},{"location":"index.html#**PGG**","page":"Home","title":"PGG","text":"","category":"section"},{"location":"index.html","page":"Home","title":"Home","text":"Probability of Ground Gate - a geometric calculation that gives the probability that a given radar gate is a result of reflection from the ground.  ___","category":"page"},{"location":"index.html#**AHT**","page":"Home","title":"AHT","text":"","category":"section"},{"location":"index.html","page":"Home","title":"Home","text":"Aircraft HeighT - calculates platform height while factoring in Earth curvature.  ___ ","category":"page"},{"location":"index.html#**Implementing-a-new-parameter**","page":"Home","title":"Implementing a new parameter","text":"","category":"section"},{"location":"index.html","page":"Home","title":"Home","text":"The code is written in such a way that it would hopefully be relatively easy for a user to add a function of their own to apply to radar data. One could go about this using the following as a guide.    ","category":"page"},{"location":"index.html","page":"Home","title":"Home","text":"There are two types of functions in Ronin: Those that act on radar variables (STD, AVG) and those that operate relatively independent of them (RNG, PGG). Functions that act on variables must be defined using a 3 letter abbreviation and begin with calc_. Furthermore, the function should take 1 positional and 2 keyword arguments. The positional argument should be the variable in matrix form to operate upon. The keyword arguments should be weights and window, where both have the same dimensions. window specifies the area for the spatial parameter to take for each gate, and weights specifies how much weight to give each neighboring gate. For example, if we wanted to define a function that gave us the logartihm of a variable, we could name it LOG, with the function defined in code as","category":"page"},{"location":"index.html","page":"Home","title":"Home","text":"function calc_LOG(var::Matrix{Union{Missing, Float64}}; weights=default_weights, window=default_window)","category":"page"},{"location":"index.html","page":"Home","title":"Home","text":"The function should return an array of the same size as var. ","category":"page"},{"location":"index.html","page":"Home","title":"Home","text":"Finally, add the three letter abbreviation LOG to the valid_funcs array at the top of RoninFeatures.jl. ","category":"page"},{"location":"index.html","page":"Home","title":"Home","text":"Congratulations! You've added a new function! ","category":"page"},{"location":"index.html","page":"Home","title":"Home","text":"","category":"page"},{"location":"index.html#Data-Conventions/Glossary","page":"Home","title":"Data Conventions/Glossary","text":"","category":"section"},{"location":"index.html","page":"Home","title":"Home","text":"","category":"page"},{"location":"index.html","page":"Home","title":"Home","text":"Some important data convetions to make note of: ","category":"page"},{"location":"index.html","page":"Home","title":"Home","text":"Meteorological Data is referred to by 1 or true\nNon-Meteorological Data is referred to by 0 or false\nELDORAscan variable names: \nRaw Velocity: VV\nQC'ed Velocity (Used for ground truth): VG\nRaw Reflectivity: ZZ\nQC'ed Reflectivity (Used for ground truth): DBZ\nNormalized Coherent Power/Signal Quality Index: NCP\nNOAA TDR scan variable names: \nRaw Velocity: VEL\nQC'ed Velocity (Used for ground truth): VG\nRaw Reflectivity: DBZ\nQC'ed Reflectivity: ZZ\nNormalized Coherent Power/Signal Quality Index: SQI","category":"page"}]
}
