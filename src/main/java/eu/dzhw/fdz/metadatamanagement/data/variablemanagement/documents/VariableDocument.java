package eu.dzhw.fdz.metadatamanagement.data.variablemanagement.documents;

import java.util.ArrayList;
import java.util.List;

import javax.validation.Valid;
import javax.validation.constraints.Size;

import org.hibernate.validator.constraints.NotBlank;
import org.springframework.data.elasticsearch.annotations.Document;

import com.google.common.base.Objects;

import eu.dzhw.fdz.metadatamanagement.data.common.documents.AbstractDocument;
import eu.dzhw.fdz.metadatamanagement.data.common.documents.DateRange;
import eu.dzhw.fdz.metadatamanagement.data.common.documents.validation.groups.ModifyValidationGroup.Create;
import eu.dzhw.fdz.metadatamanagement.data.common.documents.validation.groups.ModifyValidationGroup.Edit;
import eu.dzhw.fdz.metadatamanagement.data.variablemanagement.documents.validation.UniqueAnswerCode;
import eu.dzhw.fdz.metadatamanagement.data.variablemanagement.documents.validation.ValidDataType;
import eu.dzhw.fdz.metadatamanagement.data.variablemanagement.documents.validation.ValidScaleLevel;
import net.karneim.pojobuilder.GeneratePojoBuilder;

/**
 * This is a representation of a variable. All fields describe the attributes of the variable, for
 * example the possible answers, the labels or the data type.
 * 
 * @author Daniel Katzberg
 *
 */
@Document(
    indexName = "#{'" + AbstractDocument.METADATA_INDEX + "_'"
        + "+T(org.springframework.context.i18n.LocaleContextHolder).getLocale().getLanguage()}",
    type = "variables")
@GeneratePojoBuilder(
    intoPackage = "eu.dzhw.fdz.metadatamanagement.data.variablemanagement.documents.builders")
public class VariableDocument extends AbstractDocument {
  // Public constants which are used in queries as fieldnames.
  public static final String ALL_STRINGS_AS_NGRAMS_FIELD = "allStringsAsNgrams";
  public static final String NAME_FIELD = "name";
  public static final String DATA_TYPE_FIELD = "dataType";
  public static final String LABEL_FIELD = "label";
  public static final String SCALE_LEVEL_FIELD = "scaleLevel";
  public static final String QUESTION_FIELD = "question";
  public static final String ANSWER_OPTIONS_FIELD = "answerOptions";
  public static final String VARIABLE_SURVEY_FIELD = "variableSurvey";
  public static final String NESTED_VARIABLE_SURVEY_TITLE_FIELD =
      VARIABLE_SURVEY_FIELD + "." + VariableSurvey.TITLE_FIELD;
  public static final String NESTED_VARIABLE_SURVEY_VARIABLE_ALIAS_FIELD =
      VARIABLE_SURVEY_FIELD + "." + VariableSurvey.VARIABLE_ALIAS_FIELD;
  public static final String NESTED_VARIABLE_SURVEY_ID_FIELD =
      VARIABLE_SURVEY_FIELD + "." + VariableSurvey.SURVEY_ID_FIELD;
  public static final String NESTED_VARIABLE_SURVEY_PERIOD_FIELD =
      VARIABLE_SURVEY_FIELD + "." + VariableSurvey.SURVEY_PERIOD_FIELD;
  public static final String NESTED_VARIABLE_SURVEY_NESTED_PERIOD_START_DATE = VARIABLE_SURVEY_FIELD
      + "." + VariableSurvey.SURVEY_PERIOD_FIELD + "." + DateRange.STARTDATE_FIELD;
  public static final String NESTED_VARIABLE_SURVEY_NESTED_PERIOD_END_DATE = VARIABLE_SURVEY_FIELD
      + "." + VariableSurvey.SURVEY_PERIOD_FIELD + "." + DateRange.ENDDATE_FIELD;
  public static final String NESTED_ANSWER_OPTIONS_CODE_FIELD =
      ANSWER_OPTIONS_FIELD + "." + AnswerOption.CODE_FIELD;
  public static final String NESTED_ANSWER_OPTIONS_LABEL_FIELD =
      ANSWER_OPTIONS_FIELD + "." + AnswerOption.LABEL_FIELD;

  /**
   * This is a nested reference to the survey.
   */
  @Valid
  private VariableSurvey variableSurvey;

  /**
   * The name of the variable.
   */
  @Size(max = 32, groups = {Create.class, Edit.class})
  @NotBlank(groups = {Create.class, Edit.class})
  private String name;

  /**
   * The data type of the variable.
   */
  @ValidDataType(groups = {Create.class, Edit.class})
  private String dataType;

  /**
   * The label of the variable.
   */
  @Size(max = 80, groups = {Create.class, Edit.class})
  private String label;

  /**
   * This field holds the questions of the variable.
   */
  @Size(max = 256, groups = {Create.class, Edit.class})
  @NotBlank(groups = {Create.class, Edit.class})
  private String question;

  /**
   * A optional scale level of the variable, if the variable is e.g. not a String.
   */
  /*
   * One more validation (must field if datatype is numeric. happens in the Validator
   * VariableDocumentValidator.
   */
  @ValidScaleLevel(groups = {Create.class, Edit.class})
  private String scaleLevel;

  /**
   * The value (answer options) with depending labels are represent in this nested field.
   */
  @Valid
  @UniqueAnswerCode(groups = {Create.class, Edit.class})
  private List<AnswerOption> answerOptions;

  /**
   * Create a variableDocument with a empty AnswerOption.
   */
  public VariableDocument() {
    this.setAnswerOptions(new ArrayList<>());
  }

  /**
   * Adds a answer Option to the list.
   * 
   * @param answerOption an AnswerOption
   * @return Feedback for successful adding
   */
  public boolean addAnswerOption(AnswerOption answerOption) {

    // ignore null options
    if (answerOption == null) {
      return false;
    }

    return this.answerOptions.add(answerOption);
  }

  /**
   * Removes a answer Option from the list.
   * 
   * @param index an the index of the AnswerOption
   * @return The deleted AnswerOption
   */
  public AnswerOption removeAnswerOption(int index) {

    // ignore wrong index
    if (index < 0 || index >= this.answerOptions.size()) {
      return null;
    }

    return this.answerOptions.remove(index);
  }

  /*
   * (non-Javadoc)
   * 
   * @see eu.dzhw.fdz.metadatamanagement.data.common.documents.AbstractDocument#toString()
   */
  @Override
  public String toString() {
    return "VariableDocument [variableSurvey=" + variableSurvey + ", name=" + name + ", dataType="
        + dataType + ", label=" + label + ", question=" + question + ", scaleLevel=" + scaleLevel
        + ", answerOptions=" + answerOptions + ", toString()=" + super.toString() + "]";
  }

  /*
   * (non-Javadoc)
   * 
   * @see eu.dzhw.fdz.metadatamanagement.data.common.documents.AbstractDocument#hashCode()
   */
  @Override
  public int hashCode() {
    return Objects.hashCode(super.hashCode(), variableSurvey, name, dataType, label, question,
        scaleLevel, answerOptions);
  }

  /*
   * (non-Javadoc)
   * 
   * @see
   * eu.dzhw.fdz.metadatamanagement.data.common.documents.AbstractDocument#equals(java.lang.Object)
   */
  @Override
  public boolean equals(Object object) {
    if (object != null && getClass() == object.getClass()) {
      if (!super.equals(object)) {
        return false;
      }
      VariableDocument that = (VariableDocument) object;
      return Objects.equal(this.variableSurvey, that.variableSurvey)
          && Objects.equal(this.name, that.name) && Objects.equal(this.dataType, that.dataType)
          && Objects.equal(this.label, that.label) && Objects.equal(this.question, that.question)
          && Objects.equal(this.scaleLevel, that.scaleLevel)
          && Objects.equal(this.answerOptions, that.answerOptions);
    }
    return false;
  }

  /* GETTER / SETTER */
  public VariableSurvey getVariableSurvey() {
    return variableSurvey;
  }

  public void setVariableSurvey(VariableSurvey variableSurvey) {
    this.variableSurvey = variableSurvey;
  }

  public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = name;
  }

  public String getLabel() {
    return label;
  }

  public void setLabel(String label) {
    this.label = label;
  }

  public String getDataType() {
    return dataType;
  }

  public void setDataType(String dataType) {
    this.dataType = dataType;
  }

  public String getScaleLevel() {
    return scaleLevel;
  }

  public void setScaleLevel(String scaleLevel) {
    this.scaleLevel = scaleLevel;
  }

  public List<AnswerOption> getAnswerOptions() {
    return answerOptions;
  }

  public void setAnswerOptions(List<AnswerOption> answerOptions) {
    this.answerOptions = answerOptions;
  }

  public String getQuestion() {
    return question;
  }

  public void setQuestion(String question) {
    this.question = question;
  }

}
