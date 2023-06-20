import torch
import torch.utils.data as data
import torchvision.transforms as transforms
import torch.nn as nn
import torchvision.models as models

class ImageEncoder(nn.Module):

    def __init__(self, embed_size):
        """
        Extract Image Features using a pre-train CNN model named VGG19
        """
        super(ImageEncoder, self).__init__()
        model = models.vgg19(pretrained=True)
        in_features = model.classifier[-1].in_features  # input size of feature vector
        model.classifier = nn.Sequential(
            *list(model.classifier.children())[:-1])    # remove last fc layer

        self.model = model                              # loaded model without last fc layer
        self.fc = nn.Linear(in_features, embed_size)    # feature vector of image

    def forward(self, image):
        """Extract feature vector from image vector.
        """
        image_feature = self.model(image)                  # [batch_size, vgg16(19)_fc=4096]
        image_feature = self.fc(image_feature)                   # [batch_size, embed_size]

        l2_norm = image_feature.norm(p=2, dim=1, keepdim=True).detach()
        image_feature = image_feature.div(l2_norm)               # l2-normalized feature vector

        return image_feature

class QuestionEncoder(nn.Module):

    def __init__(self, question_vocab_size, word_embed_size, embed_size, num_layers, hidden_size):
        """
        Extract question featues:
            - step 1: using word2vec
            - step 2: using LSTM
        """
        super(QuestionEncoder, self).__init__()
        self.word2vec = nn.Embedding(question_vocab_size, word_embed_size)
        self.tanh = nn.Tanh()
        self.lstm = nn.LSTM(word_embed_size, hidden_size, num_layers)
        self.fc = nn.Linear(2*num_layers*hidden_size, embed_size)     # 2 for hidden and cell states

    def forward(self, question):

        question_vec = self.word2vec(question)                             # [batch_size, max_question_length=30, word_embed_size=300]
        question_vec = self.tanh(question_vec)
        question_vec = question_vec.transpose(0, 1)                             # [max_question_length=30, batch_size, word_embed_size=300]
        _, (hidden, cell) = self.lstm(question_vec)                        # [num_layers=2, batch_size, hidden_size=512]
        question_feature = torch.cat((hidden, cell), 2)                    # [num_layers=2, batch_size, 2*hidden_size=1024]
        question_feature = question_feature.transpose(0, 1)                     # [batch_size, num_layers=2, 2*hidden_size=1024]
        question_feature = question_feature.reshape(question_feature.size()[0], -1)  # [batch_size, 2*num_layers*hidden_size=2048]
        question_feature = self.tanh(question_feature)
        question_feature = self.fc(question_feature)                            # [batch_size, embed_size]

        return question_feature

class VqaModel(nn.Module):

    def __init__(self, question_vocab_size, ans_vocab_size, model_config):
        """
        Fusing Image feature and question feature using Full Connected Layer
        """
        super(VqaModel, self).__init__()
        self.image_encoder = ImageEncoder(model_config["dense_hidden_size"])
        self.question_encoder = QuestionEncoder(question_vocab_size,
                                                model_config["word_embedding_size"],
                                                model_config["dense_hidden_size"],
                                                model_config["rnn_layers"],
                                                model_config["dense_hidden_size"])
        self.tanh = nn.Tanh()
        self.dropout = nn.Dropout(0.5)
        self.fc1 = nn.Linear(model_config["dense_hidden_size"], ans_vocab_size)
        self.fc2 = nn.Linear(ans_vocab_size, ans_vocab_size)

    def forward(self, image, question):

        image_feature = self.image_encoder(image)                     # [batch_size, embed_size]
        question_feature = self.question_encoder(question)                     # [batch_size, embed_size]
        combined_feature = torch.mul(image_feature, question_feature)  # [batch_size, embed_size]
        combined_feature = self.tanh(combined_feature)
        combined_feature = self.dropout(combined_feature)
        combined_feature = self.fc1(combined_feature)           
        combined_feature = self.tanh(combined_feature)
        combined_feature = self.dropout(combined_feature)
        combined_feature = self.fc2(combined_feature)

        return combined_feature
