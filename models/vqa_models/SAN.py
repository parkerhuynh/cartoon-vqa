import torch.nn as nn
import torch
import torchvision.models as models
class ImageEncoder(nn.Module):

    def __init__(self, embedding_size):
        """
        Extract Image Features using a pre-train CNN model named VGG19
        """
        super(ImageEncoder, self).__init__()
        model = models.vgg16(pretrained=True)
        in_features = model.classifier[-1].in_features
        model.classifier = nn.Sequential(
            *list(model.classifier.children())[:-1])
        self.model = model  
        self.fc = nn.Linear(in_features, embedding_size) 
        
    def forward(self, image):
        """Extract feature vector from image vector.
        """
        
        image_feature = self.model(image)
        image_feature = self.fc(image_feature)
        l2_norm = image_feature.norm(p=2, dim=1, keepdim=True).detach()
        image_feature = image_feature.div(l2_norm)
        return image_feature

class QuestionEncoder(nn.Module):

    def __init__(self, question_vocab_size, word_embed_size, rnn_embed_size, num_layers, hidden_size):
        """
        Extract question featues:
            - step 1: using word2vec
            - step 2: using LSTM
        """
        super(QuestionEncoder, self).__init__()
        self.word2vec = nn.Embedding(question_vocab_size, word_embed_size)
        self.tanh = nn.Tanh()
        self.lstm = nn.LSTM(word_embed_size, rnn_embed_size, num_layers)
        self.fc = nn.Linear(2*num_layers*rnn_embed_size, hidden_size)

    def forward(self, question):

        question_vec = self.word2vec(question)
        question_vec = self.tanh(question_vec)
        question_vec = question_vec.transpose(0, 1)
        _, (hidden, cell) = self.lstm(question_vec)
        question_feature = torch.cat((hidden, cell), 2)
        question_feature = question_feature.transpose(0, 1)
        question_feature = question_feature.reshape(question_feature.size()[0], -1)
        question_feature = self.tanh(question_feature)
        question_feature = self.fc(question_feature)

        return question_feature

class Attention(nn.Module):
    def __init__(self, num_channels, embed_size, dropout=True):
        """Stacked attention Module
        """
        super(Attention, self).__init__()
        self.ff_image = nn.Linear(embed_size, num_channels)
        self.ff_questions = nn.Linear(embed_size, num_channels)
        self.dropout = nn.Dropout(p=0.5)
        self.ff_attention = nn.Linear(num_channels, 1)

    def forward(self, vi, vq):
        """Extract feature vector from image vector.
        """
        hi = self.ff_image(vi)
        hq = self.ff_questions(vq).unsqueeze(dim=1)
        ha = torch.tanh(hi+hq)
        if self.dropout:
            ha = self.dropout(ha)
        ha = self.ff_attention(ha)
        pi = torch.softmax(ha, dim=1)
        self.pi = pi
        vi_attended = (pi * vi).sum(dim=1)
        u = vi_attended + vq
        return u
    
class SANModel(nn.Module):
    # num_attention_layer and num_mlp_layer not implemented yet
    def __init__(self, question_vocab_size, ans_vocab_size, model_config):          # embed_size, word_embed_size, num_layers, hidden_size
        super(SANModel, self).__init__()
        self.num_attention_layer = 2
        self.num_mlp_layer = 1
        self.img_encoder = ImageEncoder(model_config["visual_embedding"])
        self.qst_encoder = QuestionEncoder(
            question_vocab_size = question_vocab_size,
            word_embed_size = model_config["word_embedding_size"],
            rnn_embed_size = model_config["rnn_embedding_size"],
            num_layers = model_config["rnn_layers"],
            hidden_size = model_config["question_embedding"])

        self.san = nn.ModuleList([Attention(512, model_config["dense_hidden_size"])]*self.num_attention_layer)
        self.tanh = nn.Tanh()
        self.mlp = nn.Sequential(nn.Dropout(p=0.5),
                            nn.Linear(model_config["dense_hidden_size"], ans_vocab_size))
        self.attn_features = []  ## attention features

    def forward(self, img, qst):

        img_feature = self.img_encoder(img)
        qst_feature = self.qst_encoder(qst)
        vi = img_feature
        u = qst_feature
        for attn_layer in self.san:
            u = attn_layer(vi, u)
            self.attn_features.append(attn_layer.pi)
            
        combined_feature = self.mlp(u)
        return combined_feature
    