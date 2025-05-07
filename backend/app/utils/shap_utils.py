import shap
import matplotlib.pyplot as plt

def generate_shap_plot(explainer, X_sample, save_path):
    if explainer and X_sample is not None:
        shap_values = explainer(X_sample)
        shap.plots.beeswarm(shap_values, show=False)
        plt.savefig(save_path)
