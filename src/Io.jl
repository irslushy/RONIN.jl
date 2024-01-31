###Function containing capabilites to split input datasets into different training/testing compoments and Otherwise
###Input/output functionality 

function remove_validation(input_dataset::String; training_output="train_no_validation_set.h5", validation_output = "validation.h5")
        
    currset = h5open(input_dataset)

    X = currset["X"][:,:]
    Y = currset["Y"][:,:] 

    ###Will include every STEP'th feature in the validation dataset 
    ###A step of 10 will mean that every 10th will feature in the validation set, and everything else in training 
    STEP = 10 

    test_indexer = [true for i=1:size(X)[1]]
    test_indexer[begin:STEP:end] .= false

    validation_indexer = .!test_indexer 

    validation_out = h5open(validation_output, "w")
    training_out = h5open(training_output, "w")
    
    write_dataset(validation_out, "X", X[validation_indexer, :])
    write_dataset(validation_out, "Y", Y[validation_indexer, :])

    write_dataset(training_out, "X", X[test_indexer, :])
    write_dataset(training_out, "Y", Y[test_indexer, :])

    close(currset)
    close(validation_out)
    close(training_out)

end