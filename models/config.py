
data_config = {
    "base_data_path": "data/cartoon_vqa.csv",
    "data_split": {
        "train": 0.7,
        "val":0.15,
        "test": 0.15
    },
    "data_save_path": "data/",
}

model_config = {
    "VQA": {
        "rnn_embedding_size": 128,
        "word_embedding_size": 64,
        "rnn_layers": 1,
        "dense_hidden_size": 128
    },
    "SAN": {
        "visual_embedding": 512, 
        "num_attention_layer": 2,
        "rnn_embedding_size": 512,
        "question_embedding":512, 
        "word_embedding_size": 300,
        "rnn_layers": 1,
        "dense_hidden_size": 512
    }
}
